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
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
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

    @Cacheable(value = "userFeed", key = "#userId + '-' + #page")
    public FeedDTO.Response getUserFeed(Long userId, int page, int size) {
        log.info("Generating feed for user {} (page: {}, size: {})", userId, page, size);

        String cacheKey = FEED_CACHE_KEY + userId;
        List<FeedItem> cachedItems = getCachedFeed(cacheKey);

        if (cachedItems != null && !cachedItems.isEmpty()) {
            log.info("Returning cached feed for user {}", userId);
            return buildResponse(cachedItems, page, size);
        }

        List<Long> followingUserIds = connectionClient.getFollowingIds(userId, "USER");
        List<Long> followingCommunityIds = connectionClient.getFollowingIds(userId, "COMMUNITY");

        log.info("User {} follows {} users and {} communities",
                userId, followingUserIds.size(), followingCommunityIds.size());

        List<FeedItem> feedItems = fetchAndRankPosts(userId, followingUserIds, followingCommunityIds);

        cacheFeed(cacheKey, feedItems);

        return buildResponse(feedItems, page, size);
    }

    @Transactional
    public FeedDTO.Response getPersonalizedFeed(Long userId, int page, int size) {
        log.info("Generating AI-personalized feed for user {}", userId);

        float[] userEmbedding = getUserPreferenceEmbedding(userId);

        List<Long> followingUserIds = connectionClient.getFollowingIds(userId, "USER");
        List<Long> followingCommunityIds = connectionClient.getFollowingIds(userId, "COMMUNITY");

        List<FeedItem> feedItems = fetchPostsWithEmbeddings(userId, followingUserIds, followingCommunityIds);

        feedItems.forEach(item -> {
            if (item.getEmbedding() != null) {
                float[] postEmbedding = item.getEmbedding().toArray();
                double relevance = rankingAlgorithm.calculateRelevanceScore(userEmbedding, postEmbedding);
                item.setRelevanceScore(relevance);
            }
        });

        List<FeedItem> rankedItems = rankingAlgorithm.rankFeed(feedItems);

        return buildResponse(rankedItems, page, size);
    }

    @Transactional
    public void trackInteraction(Long userId, String postId, InteractionType type, Integer durationSeconds) {
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
    public void addPostToFeeds(String postId, Long authorId, Long communityId, String title, String content) {
        log.info("Adding post {} to follower feeds", postId);

        List<Long> followerIds = communityId != null
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
        for (Long userId : followerIds) {
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
    }

    private List<FeedItem> fetchAndRankPosts(Long userId, List<Long> userIds, List<Long> communityIds) {
        Page<FeedItem> page = feedItemRepository.findByUserIdAndHiddenFalseOrderByCreatedAtDesc(
                userId, PageRequest.of(0, 100));

        return page.getContent();
    }

    private List<FeedItem> fetchPostsWithEmbeddings(Long userId, List<Long> userIds, List<Long> communityIds) {
        Page<FeedItem> page = feedItemRepository.findByUserIdAndHiddenFalseAndEmbeddingIsNotNullOrderByFinalScoreDesc(
                userId, PageRequest.of(0, 100));

        return page.getContent();
    }

    private float[] getUserPreferenceEmbedding(Long userId) {
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

    private List<FeedItem> getCachedFeed(String key) {
        return (List<FeedItem>) redisTemplate.opsForValue().get(key);
    }

    private void cacheFeed(String key, List<FeedItem> items) {
        redisTemplate.opsForValue().set(key, items, 1, TimeUnit.HOURS);
    }

    private void invalidateFeedCache(Long userId) {
        String key = FEED_CACHE_KEY + userId;
        redisTemplate.delete(key);
        log.info("Invalidated feed cache for user {}", userId);
    }

    private FeedDTO.Response buildResponse(List<FeedItem> items, int page, int size) {
        int start = page * size;
        int end = Math.min(start + size, items.size());

        List<FeedItem> pageItems = items.subList(start, end);

        List<FeedDTO.FeedItemDTO> dtos = pageItems.stream()
                .map(this::mapToDTO)
                .toList();

        return FeedDTO.Response.builder()
                .items(dtos)
                .page(page)
                .size(size)
                .totalItems(items.size())
                .hasMore(end < items.size())
                .build();
    }

    private FeedDTO.FeedItemDTO mapToDTO(FeedItem item) {
        PostDTO post = postClient.getPost(item.getPostId());

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
    }
}
