package com.app.analyticssvc.consumer;

import com.app.analyticssvc.event.*;
import com.app.analyticssvc.services.AnalyticsService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AnalyticsEventConsumer {

    private final AnalyticsService analyticsService;
    private final ObjectMapper objectMapper;

    @KafkaListener(
            topics = "post.created",
            groupId = "${spring.kafka.consumer.group-id}",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void consumePostEvent(@Payload String message,
                                  @Header(KafkaHeaders.RECEIVED_TOPIC) String topic,
                                  @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
                                  @Header(KafkaHeaders.OFFSET) long offset) {
        try {
            log.info("Received post event from topic={} partition={} offset={}", topic, partition, offset);
            PostEvent event = objectMapper.readValue(message, PostEvent.class);
            analyticsService.processPostEvent(event);
        } catch (Exception e) {
            log.error("Failed to process post event: {}", e.getMessage(), e);
        }
    }

    @KafkaListener(
            topics = "comment.added",
            groupId = "${spring.kafka.consumer.group-id}",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void consumeCommentEvent(@Payload String message,
                                     @Header(KafkaHeaders.RECEIVED_TOPIC) String topic,
                                     @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
                                     @Header(KafkaHeaders.OFFSET) long offset) {
        try {
            log.info("Received comment event from topic={} partition={} offset={}", topic, partition, offset);
            CommentEvent event = objectMapper.readValue(message, CommentEvent.class);
            analyticsService.processCommentEvent(event);
        } catch (Exception e) {
            log.error("Failed to process comment event: {}", e.getMessage(), e);
        }
    }

    @KafkaListener(
            topics = "vote.changed",
            groupId = "${spring.kafka.consumer.group-id}",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void consumeVoteEvent(@Payload String message,
                                  @Header(KafkaHeaders.RECEIVED_TOPIC) String topic,
                                  @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
                                  @Header(KafkaHeaders.OFFSET) long offset) {
        try {
            log.info("Received vote event from topic={} partition={} offset={}", topic, partition, offset);
            VoteEvent event = objectMapper.readValue(message, VoteEvent.class);
            analyticsService.processVoteEvent(event);
        } catch (Exception e) {
            log.error("Failed to process vote event: {}", e.getMessage(), e);
        }
    }



    @KafkaListener(
            topics = "user.registered",
            groupId = "${spring.kafka.consumer.group-id}",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void consumeUserEvent(@Payload String message,
                                  @Header(KafkaHeaders.RECEIVED_TOPIC) String topic,
                                  @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
                                  @Header(KafkaHeaders.OFFSET) long offset) {
        try {
            log.info("Received user event from topic={} partition={} offset={}", topic, partition, offset);
            UserEvent event = objectMapper.readValue(message, UserEvent.class);
            analyticsService.processUserEvent(event);
        } catch (Exception e) {
            log.error("Failed to process user event: {}", e.getMessage(), e);
        }
    }

    @KafkaListener(
            topics = "content-moderated",
            groupId = "${spring.kafka.consumer.group-id}",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void consumeModerationEvent(@Payload String message,
                                        @Header(KafkaHeaders.RECEIVED_TOPIC) String topic,
                                        @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
                                        @Header(KafkaHeaders.OFFSET) long offset) {
        try {
            log.info("Received moderation event from topic={} partition={} offset={}", topic, partition, offset);
            ModerationEvent event = objectMapper.readValue(message, ModerationEvent.class);
            analyticsService.processModerationEvent(event);
        } catch (Exception e) {
            log.error("Failed to process moderation event: {}", e.getMessage(), e);
        }
    }

    @KafkaListener(
            topics = "post.viewed",
            groupId = "${spring.kafka.consumer.group-id}",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void consumeViewEvent(@Payload String message,
                                  @Header(KafkaHeaders.RECEIVED_TOPIC) String topic,
                                  @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
                                  @Header(KafkaHeaders.OFFSET) long offset) {
        try {
            log.info("Received view event from topic={} partition={} offset={}", topic, partition, offset);
            PostEvent event = objectMapper.readValue(message, PostEvent.class);
            analyticsService.processViewEvent(event);
        } catch (Exception e) {
            log.error("Failed to process view event: {}", e.getMessage(), e);
        }
    }
}