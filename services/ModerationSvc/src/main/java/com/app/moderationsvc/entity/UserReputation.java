package com.app.moderationsvc.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_reputations", indexes = {
        @Index(name = "idx_user_id", columnList = "user_id", unique = true),
        @Index(name = "idx_trust_score", columnList = "trust_score")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserReputation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long userId;

    @Column(nullable = false)
    @Builder.Default
    private Double trustScore = 1.0;

    @Column(nullable = false)
    @Builder.Default
    private Long totalPosts = 0L;

    @Column(nullable = false)
    @Builder.Default
    private Long flaggedPosts = 0L;

    @Column(nullable = false)
    @Builder.Default
    private Long removedPosts = 0L;

    @Column(nullable = false)
    @Builder.Default
    private Long totalComments = 0L;

    @Column(nullable = false)
    @Builder.Default
    private Long flaggedComments = 0L;

    @Column(nullable = false)
    @Builder.Default
    private Long upvotesReceived = 0L;

    @Column(nullable = false)
    @Builder.Default
    private Long downvotesReceived = 0L;

    @Column(nullable = false)
    @Builder.Default
    private Long reportsReceived = 0L;

    @Column(nullable = false)
    @Builder.Default
    private boolean shadowBanned = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean permanentlyBanned = false;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private LocalDateTime lastViolationAt;
}