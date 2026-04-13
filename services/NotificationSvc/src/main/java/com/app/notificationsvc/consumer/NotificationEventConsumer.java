package com.app.notificationsvc.consumer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;
import com.app.notificationsvc.events.*;
import com.app.notificationsvc.services.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationEventConsumer {

    private final NotificationService notificationService;

    @KafkaListener(topics = "comment.created", groupId = "${spring.kafka.consumer.group-id}")
    public void consumeCommentCreated(@Payload CommentEvent event) {
        log.info("Processing comment.created event: {}", event.getCommentId());

        if (event.getParentCommentId() != null) {
            notificationService.createReplyNotification(event);
        } else {
            notificationService.createCommentNotification(event);
        }
    }

    @KafkaListener(topics = "vote.cast", groupId = "${spring.kafka.consumer.group-id}")
    public void consumeVote(@Payload VoteEvent event) {
        log.info("Processing vote.cast event for target: {}", event.getTargetId());

        if (event.getVoteValue() > 0) {
            notificationService.createUpvoteNotification(event);
        }
    }

    @KafkaListener(topics = "moderation.flagged", groupId = "${spring.kafka.consumer.group-id}")
    public void consumeModerationFlag(@Payload ModerationEvent event) {
        log.info("Processing moderation.flagged event: {}", event.getContentId());
        notificationService.createModerationNotification(event);
    }

    @KafkaListener(topics = "moderation.approved", groupId = "${spring.kafka.consumer.group-id}")
    public void consumeModerationApproved(@Payload ModerationEvent event) {
        log.info("Processing moderation.approved event: {}", event.getContentId());
        notificationService.createApprovalNotification(event);
    }

    @KafkaListener(topics = "user.mentioned", groupId = "${spring.kafka.consumer.group-id}")
    public void consumeMention(@Payload MentionEvent event) {
        log.info("Processing user.mentioned event for user: {}", event.getMentionedUserId());
        notificationService.createMentionNotification(event);
    }

    @KafkaListener(topics = "post.trending", groupId = "${spring.kafka.consumer.group-id}")
    public void consumeTrendingPost(@Payload PostEvent event) {
        log.info("Processing post.trending event: {}", event.getPostId());
        notificationService.createTrendingNotification(event);
    }
}
