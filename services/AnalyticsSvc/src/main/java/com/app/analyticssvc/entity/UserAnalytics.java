package com.app.analyticssvc.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_analytics", indexes = {
        @Index(name = "idx_user_date", columnList = "userId,date")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserAnalytics {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private LocalDateTime date;

    private Integer postsCreated;
    private Integer commentsCreated;
    private Integer upvotesGiven;
    private Integer downvotesGiven;
    private Integer upvotesReceived;
    private Integer downvotesReceived;
    private Integer sessionsCount;
    private Long totalSessionDuration;
    private Integer uniqueCommunitiesVisited;
    private Double engagementScore;
    private Double trustScore;
}
