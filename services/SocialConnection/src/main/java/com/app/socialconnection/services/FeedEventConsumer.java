package com.app.socialconnection.services;

import com.app.socialconnection.repository.CommunityFollowerRepository;
import com.app.socialconnection.repository.ConnectionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class FeedEventConsumer {

    private final ConnectionRepository connectionRepository;
    private final CommunityFollowerRepository communityFollowerRepository;
    private final KafkaProducerService kafkaProducerService;

    @KafkaListener(topics = "post.created", groupId = "connection-service-feed-group")
    public void handlePostCreated(Map<String, Object> event) {
        try {
            // 🎓 LEARNING: Handling polymorphic IDs from Kafka
            // We ensure IDs are treated as Strings (UUIDs) for consistency.
            String authorId = String.valueOf(event.get("authorId"));
            String postId = String.valueOf(event.get("postId"));
            String type = String.valueOf(event.get("type"));

            log.info("Processing post created event: postId={}, authorId={}, type={}",
                    postId, authorId, type);

            List<String> followerIds;

            if ("USER_POST".equals(type)) {
                followerIds = connectionRepository.findFollowerIdsByUserId(authorId);
            } else if ("COMMUNITY_POST".equals(type)) {
                String communityId = String.valueOf(event.get("communityId"));
                
                followerIds = communityFollowerRepository.findUserIdsByCommunityId(communityId);
            } else {
                log.warn("Unknown post type: {}", type);
                return;
            }

            // Publish fanout event for Feed Service to consume and cache
            kafkaProducerService.publishFeedFanoutEvent(postId, authorId, type, followerIds);

            log.info("Published feed fanout for post {} to {} followers", postId, followerIds.size());

        } catch (Exception e) {
            log.error("Error processing post created event", e);
        }
    }

    @KafkaListener(topics = "reputation-updated", groupId = "connection-service-reputation-group")
    public void handleReputationUpdate(Map<String, Object> event) {
        try {
            String userId = String.valueOf(event.get("userId"));
            Double trustScore = ((Number) event.get("trustScore")).doubleValue();

            log.info("User {} reputation updated: trustScore={}", userId, trustScore);

            if (trustScore < 0.3) {
                log.warn("Low trust score detected for user {}, potential spam account", userId);
            }

        } catch (Exception e) {
            log.error("Error processing reputation update", e);
        }
    }
}