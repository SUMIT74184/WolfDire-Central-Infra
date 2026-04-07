package org.app.event;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.app.services.FeedService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class FeedEventConsumer {

    private final FeedService feedService;

    @KafkaListener(topics = "post.created", groupId = "feed-service-group")
    public void handlePostCreated(Map<String, Object> event) {
        try {
            String postId = (String) event.get("postId");
            Long authorId = ((Number) event.get("authorId")).longValue();
            Long communityId = event.get("communityId") != null
                    ? ((Number) event.get("communityId")).longValue()
                    : null;
            String title = (String) event.get("title");
            String content = (String) event.get("content");

            log.info("Processing post.created event: postId={}, authorId={}, communityId={}",
                    postId, authorId, communityId);

            feedService.addPostToFeeds(postId, authorId, communityId, title, content);

        } catch (Exception e) {
            log.error("Error processing post.created event", e);
        }
    }

    @KafkaListener(topics = "feed.update", groupId = "feed-service-group")
    public void handleFeedUpdate(Map<String, Object> event) {
        try {
            Long userId = ((Number) event.get("userId")).longValue();
            String action = (String) event.get("action");

            log.info("Processing feed.update event: userId={}, action={}", userId, action);

            if ("REFRESH_FEED".equals(action)) {
                log.info("Feed refresh triggered for user {}", userId);
            }

        } catch (Exception e) {
            log.error("Error processing feed.update event", e);
        }
    }

}
