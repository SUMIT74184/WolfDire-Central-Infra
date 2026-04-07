package org.app.postsvcwolf.config;


import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfig {

    @Bean
    public NewTopic postCreatedTopic() {
        return TopicBuilder.name("post.created")
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic commentAddedTopic() {
        return TopicBuilder.name("comment.added")
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic voteChangedTopic() {
        return TopicBuilder.name("vote.changed")
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic postFlaggedTopic() {
        return TopicBuilder.name("post.flagged")
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic mediaUploadedTopic() {
        return TopicBuilder.name("media.uploaded")
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic userMentionedTopic() {
        return TopicBuilder.name("user.mentioned")
                .partitions(3)
                .replicas(1)
                .build();
    }
}
