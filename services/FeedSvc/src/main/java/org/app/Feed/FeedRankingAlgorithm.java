package org.app.Feed;


import lombok.extern.slf4j.Slf4j;
import org.app.entity.FeedItem;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Component
@Slf4j
public class FeedRankingAlgorithm {

    @Value("${feed.ranking.relevance-weight}")
    private Double relevanceWeight;

    @Value("${feed.ranking.recency-weight}")
    private Double recencyWeight;

    @Value("${feed.ranking.popularity-weight}")
    private Double popularityWeight;


    public List<FeedItem> rankFeed(List<FeedItem>items){
        log.info("Ranking {} feed items",items.size());

        items.forEach(this::calculateFinalScore);
        items.sort((a,b)->Double.compare(b.getFinalScore(),a.getFinalScore()));

        return items;

    }

    private void calculateFinalScore(FeedItem item){
        double relevance = item.getRelevanceScore();
        double recency = calculateRecencyScore(item.getPostCreatedAt());
        double popularity = item.getPopularityScore();


        double finalScore = (relevance * relevanceWeight) +
                (recency * recencyWeight) +
                (popularity * popularityWeight);

        item.setFinalScore(finalScore);

        log.debug("Post {}: relevance={}, recency={},popularity={},final={}",
                item.getPostId(),recency,relevance,popularity,finalScore
                );

    }

    private double calculateRecencyScore(LocalDateTime postCreatedAt){
        if (postCreatedAt == null)
            return 0.0;

        long hoursOld = Duration.between(postCreatedAt, LocalDateTime.now()).toHours();

        if (hoursOld < 1) return 1.0;
        if (hoursOld < 3) return 0.9;
        if (hoursOld < 6) return 0.8;
        if (hoursOld < 12) return 0.7;
        if (hoursOld < 24) return 0.5;
        if (hoursOld < 48) return 0.3;
        if (hoursOld < 72) return 0.1;

        return 0.05;

    }

    public double calculatePopularityScore(long upvotes, long downvotes, long comments, long shares) {
        double upvoteScore = Math.log10(upvotes + 1) * 0.4;
        double commentScore = Math.log10(comments + 1) * 0.3;
        double shareScore = Math.log10(shares + 1) * 0.2;
        double downvotePenalty = Math.log10(downvotes + 1) * 0.1;

        double score = upvoteScore + commentScore + shareScore - downvotePenalty;

        return Math.min(1.0, Math.max(0.0, score / 5.0));
    }

    public double calculateRelevanceScore(float[] userEmbedding, float[] postEmbedding){
        if(userEmbedding == null || postEmbedding == null){
            return 0.5;
        }

        double cosineSim = cosineSimilarity(userEmbedding,postEmbedding);
        return (cosineSim + 1.0)/2.0;
    }

    private double cosineSimilarity(float[] vectorA, float[] vectorB){
        if(vectorA.length != vectorB.length){
            throw new IllegalArgumentException("Vectors must have same dimension");
        }

        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;

        for(int i =0; i< vectorA.length;i++){
            dotProduct += vectorA[i] * vectorB[i];
            normA += vectorA[i] * vectorA[i];
            normB += vectorB[i] * vectorB[i];
        }

        if (normA == 0.0 || normB == 0.0) {
            return 0.0;
        }

        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }



}
