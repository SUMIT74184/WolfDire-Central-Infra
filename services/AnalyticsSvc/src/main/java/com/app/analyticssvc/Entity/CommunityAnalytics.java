package com.app.analyticssvc.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "community_analytics", indexes = {
        @Index(name = "idx_community_date", columnList = "communityId,date")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommunityAnalytics {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String communityId;

    @Column(nullable = false)
    private LocalDateTime date;

    private Integer newMembers;
    private Integer activeUsers;
    private Integer postsCreated;
    private Integer commentsCreated;
    private Integer totalEngagements;
    private Double growthRate;
    private Double engagementRate;
}
