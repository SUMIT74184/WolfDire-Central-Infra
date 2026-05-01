package com.app.socialconnection.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "community_followers",
        indexes = {
                @Index(name = "idx_community_user", columnList = "communityId,userId")
        },
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"communityId", "userId"})
        })
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommunityFollower {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false)
    private Long communityId;

    @Column(nullable = false)
    private Long userId;


    @Column(nullable = false)
    private LocalDateTime followedAt;

    @Column
    private boolean notificationsEnabled;

    @PrePersist
    protected void onCreate() {
        followedAt = LocalDateTime.now();
        notificationsEnabled = true;
    }

}
