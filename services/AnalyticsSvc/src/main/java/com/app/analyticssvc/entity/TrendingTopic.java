package com.app.analyticssvc.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "trending_topics", indexes = {
        @Index(name = "idx_score_timestamp", columnList = "trendScore,timestamp")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrendingTopic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String topic;

    private Integer mentionCount;
    private Double trendScore;
    private Double velocity;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(nullable = false)
    private LocalDateTime lastUpdated;
}
