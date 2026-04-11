package com.app.analyticssvc.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.concurrent.TimeUnit;

import com.app.analyticssvc.event.*;
import com.app.analyticssvc.repositories.*;
import com.app.analyticssvc.Entity.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsService {

    private final EventLogRepository eventLogRepository;
    private final UserAnalyticsRepository userAnalyticsRepository;
    private final ContentAnalyticsRepository contentAnalyticsRepository;
    private final SubredditAnalyticsRepository subredditAnalyticsRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    @Async
    @Transactional
    public void processPostEvent(PostEvent event) {
        saveEventLog(event.getEventId(), event.getEventType(), event.getUserId(),
                event.getPostId(), "POST", event.getAction(), event.getMetadata());

        updateUserAnalytics(event.getUserId(), "POST_CREATED");
        updateContentAnalytics(event.getPostId(), "POST");
        updateSubredditAnalytics(event.getSubredditId());

        incrementRedisCounter("posts:today", 1);
        incrementRedisCounter("user:" + event.getUserId() + ":posts", 1);
    }

    @Async
    @Transactional
    public void processCommentEvent(CommentEvent event) {
        saveEventLog(event.getEventId(), event.getEventType(), event.getUserId(),
                event.getCommentId(), "COMMENT", event.getAction(), null);

        updateUserAnalytics(event.getUserId(), "COMMENT_CREATED");
        updateContentAnalytics(event.getPostId(), "POST");

        incrementRedisCounter("comments:today", 1);
    }

    @Async
    @Transactional
    public void processVoteEvent(VoteEvent event) {
        saveEventLog(event.getEventId(), event.getEventType(), event.getUserId(),
                event.getTargetId(), event.getTargetType(), "VOTE", String.valueOf(event.getVoteValue()));

        updateUserAnalytics(event.getUserId(), event.getVoteValue() > 0 ? "UPVOTE_GIVEN" : "DOWNVOTE_GIVEN");
        updateContentAnalytics(event.getTargetId(), event.getTargetType());

        String key = event.getTargetType() + ":" + event.getTargetId() + ":score";
        incrementRedisCounter(key, event.getVoteValue());
    }

    @Async
    @Transactional
    public void processUserEvent(UserEvent event) {
        saveEventLog(event.getEventId(), event.getEventType(), event.getUserId(),
                null, "USER", event.getAction(), event.getUserAgent());

        if ("LOGIN".equals(event.getAction())) {
            updateUserAnalytics(event.getUserId(), "SESSION_START");
        }
    }

    @Async
    @Transactional
    public void processModerationEvent(ModerationEvent event) {
        saveEventLog(event.getEventId(), event.getEventType(), event.getModeratorId(),
                event.getContentId(), event.getContentType(), event.getAction(), event.getReason());

        incrementRedisCounter("moderation:flags:today", 1);

        if (event.getToxicityScore() != null && event.getToxicityScore() > 0.8) {
            incrementRedisCounter("content:" + event.getContentId() + ":toxicity", 1);
        }
    }

    @Async
    @Transactional
    public void processViewEvent(PostEvent event) {
        updateContentAnalytics(event.getPostId(), "POST");

        String dailyKey = "views:" + LocalDateTime.now().toLocalDate();
        incrementRedisCounter(dailyKey, 1);

        String contentKey = "content:" + event.getPostId() + ":views";
        incrementRedisCounter(contentKey, 1);
    }

    private void saveEventLog(String eventId, String eventType, Long userId,
            Long targetId, String targetType, String action, String metadata) {
        EventLog log = new EventLog();
        log.setEventId(eventId);
        log.setEventType(eventType);
        log.setUserId(userId);
        log.setTargetId(targetId);
        log.setTargetType(targetType);
        log.setAction(action);
        log.setMetadata(metadata);
        log.setTimestamp(LocalDateTime.now());

        eventLogRepository.save(log);
    }

    private void updateUserAnalytics(Long userId, String action) {
        LocalDateTime today = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
        UserAnalytics analytics = userAnalyticsRepository.findByUserIdAndDate(userId, today);

        if (analytics == null) {
            analytics = new UserAnalytics();
            analytics.setUserId(userId);
            analytics.setDate(today);
            analytics.setPostsCreated(0);
            analytics.setCommentsCreated(0);
            analytics.setUpvotesGiven(0);
            analytics.setDownvotesGiven(0);
            analytics.setSessionsCount(0);
        }

        switch (action) {
            case "POST_CREATED" -> analytics.setPostsCreated(analytics.getPostsCreated() + 1);
            case "COMMENT_CREATED" -> analytics.setCommentsCreated(analytics.getCommentsCreated() + 1);
            case "UPVOTE_GIVEN" -> analytics.setUpvotesGiven(analytics.getUpvotesGiven() + 1);
            case "DOWNVOTE_GIVEN" -> analytics.setDownvotesGiven(analytics.getDownvotesGiven() + 1);
            case "SESSION_START" -> analytics.setSessionsCount(analytics.getSessionsCount() + 1);
        }

        userAnalyticsRepository.save(analytics);
    }

    private void updateContentAnalytics(Long contentId, String contentType) {
        LocalDateTime today = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
        ContentAnalytics analytics = contentAnalyticsRepository
                .findByContentIdAndContentTypeAndDate(contentId, contentType, today);

        if (analytics == null) {
            analytics = new ContentAnalytics();
            analytics.setContentId(contentId);
            analytics.setContentType(contentType);
            analytics.setDate(today);
            analytics.setViewCount(0);
            analytics.setUpvotes(0);
            analytics.setDownvotes(0);
            analytics.setCommentCount(0);
        }

        analytics.setViewCount(analytics.getViewCount() + 1);
        contentAnalyticsRepository.save(analytics);
    }

    private void updateSubredditAnalytics(String subredditId) {
        LocalDateTime today = LocalDateTime.now().truncatedTo(ChronoUnit.DAYS);
        SubredditAnalytics analytics = subredditAnalyticsRepository.findBySubredditIdAndDate(subredditId, today);

        if (analytics == null) {
            analytics = new SubredditAnalytics();
            analytics.setSubredditId(subredditId);
            analytics.setDate(today);
            analytics.setPostsCreated(0);
        }

        analytics.setPostsCreated(analytics.getPostsCreated() + 1);
        subredditAnalyticsRepository.save(analytics);
    }

    private void incrementRedisCounter(String key, long delta) {
        redisTemplate.opsForValue().increment(key, delta);
        redisTemplate.expire(key, 7, TimeUnit.DAYS);
    }
}