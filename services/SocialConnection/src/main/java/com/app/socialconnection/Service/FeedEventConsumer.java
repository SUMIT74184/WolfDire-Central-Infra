package com.app.socialconnection.Service;

import com.app.socialconnection.Repository.CommunityFollowerRepository;
import com.app.socialconnection.Repository.ConnectionRepository;
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
            Long authorId = ((Number) event.get("authorId")).longValue();
            String postId = (String) event.get("postId");
            String type = (String) event.get("type");

            log.info("Processing post created event: postId={}, authorId={}, type={}",
                    postId, authorId, type);

            List<Long> followerIds;

            if ("USER_POST".equals(type)) {
                followerIds = connectionRepository.findFollowerIdsByUserId(authorId);
            } else if ("COMMUNITY_POST".equals(type)) {
                Long communityId = ((Number) event.get("communityId")).longValue();
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
            Long userId = ((Number) event.get("userId")).longValue();
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