package com.app.analyticssvc.services;

import com.app.analyticssvc.dto.AnalyticsResponse;
import com.app.analyticssvc.repositories.*;
import com.app.analyticssvc.entity.*;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalyticsQueryService {

    private final UserAnalyticsRepository userAnalyticsRepository;
    private final ContentAnalyticsRepository contentAnalyticsRepository;
    private final CommunityAnalyticsRepository communityAnalyticsRepository;
    private final TrendingTopicRepository trendingTopicRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    public AnalyticsResponse getUserAnalytics(Long userId, LocalDateTime start, LocalDateTime end) {
        List<UserAnalytics> analytics = userAnalyticsRepository.findByUserIdAndDateBetween(userId, start, end);

        Map<String, Object> data = new HashMap<>();
        data.put("userId", userId);
        data.put("analytics", analytics);
        data.put("totalPosts", analytics.stream().mapToInt(UserAnalytics::getPostsCreated).sum());
        data.put("totalComments", analytics.stream().mapToInt(UserAnalytics::getCommentsCreated).sum());

        return new AnalyticsResponse("success", data);
    }

    public AnalyticsResponse getContentAnalytics(Long contentId, String contentType) {
        List<ContentAnalytics> analytics = contentAnalyticsRepository
                .findAll()
                .stream()
                .filter(a -> a.getContentId().equals(contentId) && a.getContentType().equals(contentType))
                .toList();

        Map<String, Object> data = new HashMap<>();
        data.put("contentId", contentId);
        data.put("analytics", analytics);
        data.put("totalViews", analytics.stream().mapToInt(ContentAnalytics::getViewCount).sum());

        return new AnalyticsResponse("success", data);
    }

    public AnalyticsResponse getCommunityAnalytics(String communityId) {
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        List<CommunityAnalytics> analytics = communityAnalyticsRepository
                .findAll()
                .stream()
                .filter(a -> a.getCommunityId().equals(communityId) && a.getDate().isAfter(weekAgo))
                .toList();

        Map<String, Object> data = new HashMap<>();
        data.put("communityId", communityId);
        data.put("analytics", analytics);

        return new AnalyticsResponse("success", data);
    }

    public AnalyticsResponse getTrendingTopics() {
        LocalDateTime hourAgo = LocalDateTime.now().minusHours(1);
        List<TrendingTopic> topics = trendingTopicRepository.findByTimestampAfterOrderByTrendScoreDesc(hourAgo);

        Map<String, Object> data = new HashMap<>();
        data.put("topics", topics.stream().limit(10).toList());

        return new AnalyticsResponse("success", data);
    }

    public AnalyticsResponse getDashboardMetrics() {
        Map<String, Object> data = new HashMap<>();

        String todayKey = "posts:today";
        Object postsToday = redisTemplate.opsForValue().get(todayKey);
        data.put("postsToday", postsToday != null ? postsToday : 0);

        String commentsKey = "comments:today";
        Object commentsToday = redisTemplate.opsForValue().get(commentsKey);
        data.put("commentsToday", commentsToday != null ? commentsToday : 0);

        return new AnalyticsResponse("success", data);
    }
}