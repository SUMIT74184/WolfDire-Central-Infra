package org.app.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;


@Configuration
public class KafkaConfig {

    public static final String POST_CREATED_TOPIC = "post.created";
    public static final String FEED_UPDATE_TOPIC = "feed.update";
    public static final String FEED_INTERACTION_TOPIC = "feed.interaction";

    @Bean
    public NewTopic postCreatedTopic() {
        return TopicBuilder.name(POST_CREATED_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic feedUpdateTopic() {
        return TopicBuilder.name(FEED_UPDATE_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic feedInteractionTopic() {
        return TopicBuilder.name(FEED_INTERACTION_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }
}
