package com.app.socialconnection.services;

import com.app.socialconnection.config.ConnectionRequestEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 🎓 LEARNING: Kafka Producer Service
 *
 * This service publishes events to Kafka topics. Other microservices
 * (like Notification Service, Feed Service) consume these events and react to them.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaProducerService {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    private static final String CONNECTION_EVENTS_TOPIC = "connection-events";
    private static final String BLOCK_EVENTS_TOPIC = "block-events";
    private static final String FEED_FANOUT_TOPIC = "feed.fanout";

    public void publishConnectionEvent(ConnectionRequestEvent event) {
        log.info("Publishing connection event: {} -> {} [{}]",
                event.getSenderId(), event.getReceiverId(), event.getStatus());
        kafkaTemplate.send(CONNECTION_EVENTS_TOPIC,
                String.valueOf(event.getReceiverId()), event);
    }

    public void publishBlockEvent(ConnectionRequestEvent event) {
        log.info("Publishing block event: {} blocked {} ",
                event.getSenderId(), event.getReceiverId());
        kafkaTemplate.send(BLOCK_EVENTS_TOPIC,
                String.valueOf(event.getReceiverId()), event);
    }

    public void publishFeedFanoutEvent(String postId, Long authorId, String type, List<Long> followerIds) {
        Map<String, Object> fanoutEvent = new HashMap<>();
        fanoutEvent.put("postId", postId);
        fanoutEvent.put("authorId", authorId);
        fanoutEvent.put("type", type);
        fanoutEvent.put("followerIds", followerIds);

        log.info("Publishing feed fanout event: postId={}, followers={}", postId, followerIds.size());
        kafkaTemplate.send(FEED_FANOUT_TOPIC, postId, fanoutEvent);
    }
}
