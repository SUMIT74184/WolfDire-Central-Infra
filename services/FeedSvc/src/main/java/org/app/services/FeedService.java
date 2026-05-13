package org.app.services;

import com.pgvector.PGvector;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.app.clients.ConnectionServiceClient;
import org.app.clients.PostServiceClient;
import org.app.algorithm.FeedRankingAlgorithm;
import org.app.dto.FeedDTO;
import org.app.dto.PostDTO;
import org.app.entity.FeedItem;
import org.app.entity.InteractionType;
import org.app.entity.UserInteraction;
import org.app.repository.FeedItemRepository;
import org.app.repository.UserInteractionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class FeedService {

    private final FeedItemRepository feedItemRepository;
    private final UserInteractionRepository userInteractionRepository;
    private final EntityManager entityManager;
    private final ConnectionServiceClient connectionClient;
    private final PostServiceClient postClient;
    private final FeedRankingAlgorithm rankingAlgorithm;
    private final EmbeddingService embeddingService;
    private final RedisTemplate<String, Object> redisTemplate;

    private static final String FEED_CACHE_KEY = "feed:user:";

    public FeedDTO.Response getUserFeed(String userId, int page, int size) {
        log.info("Generating feed for user {} (page: {}, size: {})", userId, page, size);

        try {
            List<String> followingUserIds = connectionClient.getFollowingIds(userId, "USER");
            List<String> followingCommunityIds = connectionClient.getFollowingIds(userId, "COMMUNITY");

            log.info("User {} follows {} users and {} communities",
                    userId, followingUserIds.size(), followingCommunityIds.size());

            Page<FeedItem> feedPage = feedItemRepository.findByUserIdAndHiddenFalseOrderByCreatedAtDesc(
                    userId, PageRequest.of(page, size));

            return buildResponse(feedPage);
        } catch (Exception e) {
            log.error("Error generating feed for user {}: {}", userId, e.getMessage());
            return FeedDTO.Response.builder()
                    .items(new ArrayList<>())
                    .page(page)
                    .size(size)
                    .totalItems(0)
                    .hasMore(false)
                    .build();
        }
    }

    @Transactional
    public FeedDTO.Response getPersonalizedFeed(String userId, int page, int size) {
        log.info("Generating AI-personalized feed for user {}", userId);

        try {
            float[] userEmbedding = getUserPreferenceEmbedding(userId);

            Page<FeedItem> feedPage = feedItemRepository
                    .findByUserIdAndHiddenFalseAndEmbeddingIsNotNullOrderByFinalScoreDesc(
                            userId, PageRequest.of(page, size));

            List<FeedItem> feedItems = new ArrayList<>(feedPage.getContent());
            feedItems.forEach(item -> {
                if (item.getEmbedding() != null) {
                    float[] postEmbedding = item.getEmbedding().toArray();
                    double relevance = rankingAlgorithm.calculateRelevanceScore(userEmbedding, postEmbedding);
                    item.setRelevanceScore(relevance);
                }
            });

            rankingAlgorithm.rankFeed(feedItems);

            return buildResponseFromList(feedItems, page, size);
        } catch (Exception e) {
            log.error("Error generating personalized feed for user {}: {}", userId, e.getMessage());
            return FeedDTO.Response.builder()
                    .items(new ArrayList<>())
                    .page(page)
                    .size(size)
                    .totalItems(0)
                    .hasMore(false)
                    .build();
        }
    }

    @Transactional
    public void trackInteraction(String userId, String postId, InteractionType type, Integer durationSeconds) {
        UserInteraction interaction = UserInteraction.builder()
                .userId(userId)
                .postId(postId)
                .interactionType(type)
                .durationSeconds(durationSeconds != null ? durationSeconds : 0)
                .build();

        userInteractionRepository.save(interaction);
        log.info("Tracked {} interaction: user={}, post={}", type, userId, postId);
        invalidateFeedCache(userId);
    }

    @Transactional
    public void addPostToFeeds(String postId, String authorId, String communityId, String title, String content) {
        log.info("Adding post {} to follower feeds", postId);

        try {
            List<String> followerIds = communityId != null
                    ? connectionClient.getFollowerIds(communityId, "COMMUNITY")
                    : connectionClient.getFollowerIds(authorId, "USER");

            float[] postEmbedding = embeddingService.generateEmbedding(
                    embeddingService.summarizePostContent(title, content));

            PostDTO postStats = postClient.getPostStats(postId);
            double popularity = rankingAlgorithm.calculatePopularityScore(
                    postStats.getUpvotes(),
                    postStats.getDownvotes(),
                    postStats.getCommentCount(),
                    postStats.getShareCount());

            List<FeedItem> feedItems = new ArrayList<>();
            for (String userId : followerIds) {
                FeedItem item = FeedItem.builder()
                        .userId(userId)
                        .postId(postId)
                        .authorId(authorId)
                        .communityId(communityId)
                        .embedding(new PGvector(postEmbedding))
                        .popularityScore(popularity)
                        .relevanceScore(0.5)
                        .postCreatedAt(LocalDateTime.now())
                        .build();
                feedItems.add(item);
            }

            feedItemRepository.saveAll(feedItems);
            log.info("Added post {} to {} feeds", postId, followerIds.size());
        } catch (Exception e) {
            log.error("Error adding post {} to feeds: {}", postId, e.getMessage());
        }
    }

    // ---- Private Helpers ----

    private FeedDTO.Response buildResponse(Page<FeedItem> page) {
        List<FeedItem> pageItems = page.getContent();
        List<FeedDTO.FeedItemDTO> dtos = batchFetchAndMapItems(pageItems);

        return FeedDTO.Response.builder()
                .items(dtos)
                .page(page.getNumber())
                .size(page.getSize())
                .totalItems((int) page.getTotalElements())
                .hasMore(!page.isLast())
                .build();
    }

    private FeedDTO.Response buildResponseFromList(List<FeedItem> items, int page, int size) {
        int start = page * size;
        int end = Math.min(start + size, items.size());
        List<FeedItem> pageItems = (start < items.size()) ? items.subList(start, end) : new ArrayList<>();
        List<FeedDTO.FeedItemDTO> dtos = batchFetchAndMapItems(pageItems);

        return FeedDTO.Response.builder()
                .items(dtos)
                .page(page)
                .size(size)
                .totalItems(items.size())
                .hasMore(end < items.size())
                .build();
    }

    /**
     * Collects all post IDs from a page of feed items and fetches them in a single
     * batch request to PostService, eliminating the N+1 service call problem.
     */
    private List<FeedDTO.FeedItemDTO> batchFetchAndMapItems(List<FeedItem> pageItems) {
        if (pageItems.isEmpty()) return new ArrayList<>();

        List<String> postIds = pageItems.stream().map(FeedItem::getPostId).toList();

        Map<String, PostDTO> postMap = new HashMap<>();
        try {
            List<PostDTO> posts = postClient.getPostsByIds(postIds);
            if (posts != null) {
                for (PostDTO post : posts) {
                    if (post != null && post.getId() != null) {
                        postMap.put(post.getId(), post);
                    }
                }
            }
        } catch (Exception e) {
            log.error("Failed to batch fetch posts for feed: {}", e.getMessage());
        }

        return pageItems.stream()
                .map(item -> {
                    PostDTO post = postMap.get(item.getPostId());
                    if (post == null) {
                        log.warn("Post {} not found, skipping feed item", item.getPostId());
                        return null;
                    }
                    return FeedDTO.FeedItemDTO.builder()
                            .postId(item.getPostId())
                            .authorId(item.getAuthorId())
                            .communityId(item.getCommunityId())
                            .title(post.getTitle())
                            .relevanceScore(item.getRelevanceScore())
                            .popularityScore(item.getPopularityScore())
                            .finalScore(item.getFinalScore())
                            .createdAt(item.getPostCreatedAt())
                            .read(item.isRead())
                            .build();
                })
                .filter(Objects::nonNull)
                .toList();
    }

    private float[] getUserPreferenceEmbedding(String userId) {
        Query query = entityManager.createNativeQuery(
                "SELECT AVG(fi.embedding) FROM feed_items fi " +
                        "JOIN user_interactions ui ON fi.post_id = ui.post_id " +
                        "WHERE ui.user_id = :userId " +
                        "AND ui.interaction_type IN ('UPVOTE', 'COMMENT', 'SAVE') " +
                        "AND fi.embedding IS NOT NULL " +
                        "LIMIT 50");

        query.setParameter("userId", userId);

        try {
            PGvector result = (PGvector) query.getSingleResult();
            return result != null ? result.toArray() : new float[1536];
        } catch (Exception e) {
            log.warn("Could not generate user embedding, using default", e);
            return new float[1536];
        }
    }

    private void invalidateFeedCache(String userId) {
        String key = FEED_CACHE_KEY + userId;
        redisTemplate.delete(key);
        log.info("Invalidated feed cache for user {}", userId);
    }
}
