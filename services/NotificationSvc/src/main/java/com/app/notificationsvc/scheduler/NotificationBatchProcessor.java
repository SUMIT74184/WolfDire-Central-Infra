package com.app.notificationsvc.scheduler;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.app.notificationsvc.entity.*;
import com.app.notificationsvc.repositories.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationBatchProcessor {

    private final NotificationRepository notificationRepository;
    private final NotificationAggregationRepository aggregationRepository;
    private final ObjectMapper objectMapper;

    @Value("${notification.batch.delay-seconds:60}")
    private int batchDelaySeconds;

    @Scheduled(fixedDelayString = "${notification.batch.delay-seconds:60}000")
    @Transactional
    public void processAggregatedNotifications() {
        log.info("Processing aggregated notifications");

        LocalDateTime threshold = LocalDateTime.now().minusSeconds(batchDelaySeconds);
        List<NotificationAggregation> aggregations = aggregationRepository
                .findBySentAtIsNullAndLastEventAtBefore(threshold);

        for (NotificationAggregation agg : aggregations) {
            try {
                createAggregatedNotification(agg);
                agg.setSentAt(LocalDateTime.now());
                aggregationRepository.save(agg);
            } catch (Exception e) {
                log.error("Error processing aggregation: {}", agg.getId(), e);
            }
        }

        log.info("Processed {} aggregated notifications", aggregations.size());
    }

    private void createAggregatedNotification(NotificationAggregation agg) throws JsonProcessingException {
        List<Long> actorIds = objectMapper.readValue(agg.getActorIds(), new TypeReference<>() {
        });

        Notification notification = new Notification();
        notification.setUserId(agg.getUserId());

        String[] parts = agg.getAggregationKey().split(":");
        NotificationType type = NotificationType.valueOf(parts[1]);

        notification.setType(type);
        notification.setAggregationKey(agg.getAggregationKey());

        if (actorIds.size() == 1) {
            notification.setTitle(getTitle(type, 1));
            notification.setMessage(getMessage(type, 1));
        } else {
            notification.setTitle(getTitle(type, actorIds.size()));
            notification.setMessage(getMessage(type, actorIds.size()));
        }

        notification.setPriority(2);
        notification.setIsSent(true);
        notification.setSentAt(LocalDateTime.now());

        notificationRepository.save(notification);
    }

    private String getTitle(NotificationType type, int count) {
        return switch (type) {
            case COMMENT_ON_POST -> count == 1 ? "New comment" : count + " new comments";
            case UPVOTE -> count == 1 ? "New upvote" : count + " new upvotes";
            default -> "New notification";
        };
    }

    private String getMessage(NotificationType type, int count) {
        return switch (type) {
            case COMMENT_ON_POST ->
                count == 1 ? "Someone commented on your post" : count + " people commented on your post";
            case UPVOTE -> count == 1 ? "Someone upvoted your content" : count + " people upvoted your content";
            default -> "You have new activity";
        };
    }

    @Scheduled(cron = "0 0 2 * * *")
    @Transactional
    public void cleanupOldNotifications() {
        log.info("Cleaning up old notifications");

        LocalDateTime cutoff = LocalDateTime.now().minusDays(90);
        List<Notification> oldNotifications = notificationRepository.findOldNotifications(cutoff);

        notificationRepository.deleteAll(oldNotifications);

        log.info("Deleted {} old notifications", oldNotifications.size());
    }
}
