package com.app.moderationsvc.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopics {

    public static final String CONTENT_MODERATED = "content-moderated";
    public static final String CONTENT_ENRICHED = "content-enriched";
    public static final String REPUTATION_UPDATED = "reputation-updated";

    @Bean
    public NewTopic contentModeratedTopic() {
        return TopicBuilder.name(CONTENT_MODERATED)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic contentEnrichedTopic() {
        return TopicBuilder.name(CONTENT_ENRICHED)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic reputationUpdatedTopic() {
        return TopicBuilder.name(REPUTATION_UPDATED)
                .partitions(3)
                .replicas(1)
                .build();
    }
}
