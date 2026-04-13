package com.app.notificationsvc.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.app.notificationsvc.entity.*;
import com.app.notificationsvc.events.*;
import com.app.notificationsvc.repositories.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationPreferenceRepository preferenceRepository;
    private final NotificationAggregationRepository aggregationRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final WebSocketNotificationService webSocketService;
    private final ObjectMapper objectMapper;

    @Async
    @Transactional
    public void createCommentNotification(CommentEvent event) {
        if (!shouldNotify(event.getPostAuthorId(), NotificationType.COMMENT_ON_POST)) {
            return;
        }

        String aggKey = generateAggregationKey(event.getPostAuthorId(), NotificationType.COMMENT_ON_POST,
                event.getPostId());

        if (shouldAggregate(aggKey, event.getPostAuthorId())) {
            aggregateNotification(aggKey, event.getPostAuthorId(), event.getUserId(), event.getTimestamp());
        } else {
            Notification notification = new Notification();
            notification.setUserId(event.getPostAuthorId());
            notification.setType(NotificationType.COMMENT_ON_POST);
            notification.setTitle("New comment on your post");
            notification.setMessage(event.getUsername() + " commented on your post");
            notification.setActorId(event.getUserId());
            notification.setActorUsername(event.getUsername());
            notification.setTargetId(event.getPostId());
            notification.setTargetType(TargetType.POST);
            notification.setActionUrl("/post/" + event.getPostId());
            notification.setAggregationKey(aggKey);
            notification.setPriority(2);

            notificationRepository.save(notification);
            sendRealTimeNotification(notification);
        }
    }

    @Async
    @Transactional
    public void createReplyNotification(CommentEvent event) {
        if (!shouldNotify(event.getPostAuthorId(), NotificationType.REPLY_TO_COMMENT)) {
            return;
        }

        Notification notification = new Notification();
        notification.setUserId(event.getPostAuthorId());
        notification.setType(NotificationType.REPLY_TO_COMMENT);
        notification.setTitle("New reply to your comment");
        notification.setMessage(event.getUsername() + " replied to your comment");
        notification.setActorId(event.getUserId());
        notification.setActorUsername(event.getUsername());
        notification.setTargetId(event.getCommentId());
        notification.setTargetType(TargetType.COMMENT);
        notification.setActionUrl("/post/" + event.getPostId() + "#comment-" + event.getCommentId());
        notification.setPriority(3);

        notificationRepository.save(notification);
        sendRealTimeNotification(notification);
    }

    @Async
    @Transactional
    public void createUpvoteNotification(VoteEvent event) {
        if (!shouldNotify(event.getTargetAuthorId(), NotificationType.UPVOTE)) {
            return;
        }

        String aggKey = generateAggregationKey(event.getTargetAuthorId(), NotificationType.UPVOTE, event.getTargetId());

        if (shouldAggregate(aggKey, event.getTargetAuthorId())) {
            aggregateNotification(aggKey, event.getTargetAuthorId(), event.getVoterId(), event.getTimestamp());
        } else {
            Notification notification = new Notification();
            notification.setUserId(event.getTargetAuthorId());
            notification.setType(NotificationType.UPVOTE);
            notification.setTitle("Your content was upvoted");
            notification.setMessage(event.getVoterUsername() + " upvoted your " + event.getTargetType().toLowerCase());
            notification.setActorId(event.getVoterId());
            notification.setActorUsername(event.getVoterUsername());
            notification.setTargetId(event.getTargetId());
            notification.setTargetType(TargetType.valueOf(event.getTargetType()));
            notification.setAggregationKey(aggKey);
            notification.setPriority(1);

            notificationRepository.save(notification);
        }
    }

    @Async
    @Transactional
    public void createModerationNotification(ModerationEvent event) {
        Notification notification = new Notification();
        notification.setUserId(event.getContentAuthorId());
        notification.setType(NotificationType.POST_FLAGGED);
        notification.setTitle("Your content has been flagged");
        notification.setMessage("Your " + event.getContentType().toLowerCase() + " was flagged: " + event.getReason());
        notification.setTargetId(event.getContentId());
        notification.setTargetType(TargetType.valueOf(event.getContentType()));
        notification.setPriority(5);

        Map<String, Object> metadata = new HashMap<>();
        metadata.put("toxicityScore", event.getToxicityScore());
        metadata.put("reason", event.getReason());

        try {
            notification.setMetadata(objectMapper.writeValueAsString(metadata));
        } catch (JsonProcessingException e) {
            log.error("Error serializing metadata", e);
        }

        notificationRepository.save(notification);
        sendRealTimeNotification(notification);
    }

    @Async
    @Transactional
    public void createApprovalNotification(ModerationEvent event) {
        Notification notification = new Notification();
        notification.setUserId(event.getContentAuthorId());
        notification.setType(NotificationType.POST_APPROVED);
        notification.setTitle("Your content has been approved");
        notification.setMessage("Your " + event.getContentType().toLowerCase() + " has been approved by moderators");
        notification.setTargetId(event.getContentId());
        notification.setTargetType(TargetType.valueOf(event.getContentType()));
        notification.setPriority(3);

        notificationRepository.save(notification);
        sendRealTimeNotification(notification);
    }

    @Async
    @Transactional
    public void createMentionNotification(MentionEvent event) {
        Notification notification = new Notification();
        notification.setUserId(event.getMentionedUserId());
        notification.setType(NotificationType.MENTION);
        notification.setTitle("You were mentioned");
        notification.setMessage(event.getMentionerUsername() + " mentioned you");
        notification.setActorId(event.getMentionerUserId());
        notification.setActorUsername(event.getMentionerUsername());
        notification.setTargetId(event.getContentId());
        notification.setTargetType(TargetType.valueOf(event.getContentType()));
        notification.setPriority(4);

        notificationRepository.save(notification);
        sendRealTimeNotification(notification);
    }

    @Async
    @Transactional
    public void createTrendingNotification(PostEvent event) {
        Notification notification = new Notification();
        notification.setUserId(event.getUserId());
        notification.setType(NotificationType.TRENDING_POST);
        notification.setTitle("Your post is trending!");
        notification.setMessage("Your post \"" + event.getTitle() + "\" is trending");
        notification.setTargetId(event.getPostId());
        notification.setTargetType(TargetType.POST);
        notification.setActionUrl("/post/" + event.getPostId());
        notification.setPriority(3);

        notificationRepository.save(notification);
        sendRealTimeNotification(notification);
    }

    private boolean shouldNotify(Long userId, NotificationType type) {
        NotificationPreference pref = preferenceRepository.findByUserId(userId)
                .orElse(createDefaultPreference(userId));

        return switch (type) {
            case COMMENT_ON_POST -> pref.getCommentNotifications();
            case REPLY_TO_COMMENT -> pref.getReplyNotifications();
            case UPVOTE -> pref.getUpvoteNotifications();
            case MENTION -> pref.getMentionNotifications();
            case POST_FLAGGED, POST_APPROVED, POST_REMOVED -> pref.getModerationNotifications();
            case NEW_FOLLOWER -> pref.getFollowerNotifications();
            default -> true;
        };
    }

    private boolean shouldAggregate(String aggKey, Long userId) {
        String cacheKey = "notif:agg:" + aggKey;
        Object cached = redisTemplate.opsForValue().get(cacheKey);
        return cached != null;
    }

    private void aggregateNotification(String aggKey, Long userId, Long actorId, LocalDateTime timestamp) {
        NotificationAggregation agg = aggregationRepository
                .findByAggregationKeyAndUserIdAndSentAtIsNull(aggKey, userId)
                .orElseGet(() -> {
                    NotificationAggregation newAgg = new NotificationAggregation();
                    newAgg.setAggregationKey(aggKey);
                    newAgg.setUserId(userId);
                    newAgg.setCount(0);
                    newAgg.setActorIds("[]");
                    newAgg.setFirstEventAt(timestamp);
                    newAgg.setLastEventAt(timestamp);
                    return newAgg;
                });

        agg.setCount(agg.getCount() + 1);
        agg.setLastEventAt(timestamp);

        try {
            List<Long> actorIds = objectMapper.readValue(agg.getActorIds(),
                    objectMapper.getTypeFactory().constructCollectionType(List.class, Long.class));
            if (!actorIds.contains(actorId)) {
                actorIds.add(actorId);
            }
            agg.setActorIds(objectMapper.writeValueAsString(actorIds));
        } catch (JsonProcessingException e) {
            log.error("Error processing actor IDs", e);
        }

        aggregationRepository.save(agg);

        String cacheKey = "notif:agg:" + aggKey;
        redisTemplate.opsForValue().set(cacheKey, "1", 5, TimeUnit.MINUTES);
    }

    private String generateAggregationKey(Long userId, NotificationType type, Long targetId) {
        return userId + ":" + type + ":" + targetId;
    }

    private void sendRealTimeNotification(Notification notification) {
        webSocketService.sendToUser(notification.getUserId(), notification);

        String cacheKey = "user:" + notification.getUserId() + ":unread";
        redisTemplate.opsForValue().increment(cacheKey);
    }

    private NotificationPreference createDefaultPreference(Long userId) {
        NotificationPreference pref = new NotificationPreference();
        pref.setUserId(userId);
        return preferenceRepository.save(pref);
    }
}