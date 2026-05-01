package com.app.socialconnection.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "connections",
        indexes = {
                @Index(name = "idx_user_follower", columnList = "userId,followerId"),
                @Index(name = "idx_follower", columnList = "followerId")
        },
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"userId", "followerId"})
        })
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Connection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long followerId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConnectionStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConnectionType type;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime acceptedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum ConnectionStatus {
        PENDING,
        ACCEPTED,
        REJECTED,
        BLOCKED
    }

    public enum ConnectionType {
        FOLLOW,
        CONNECTION
    }
}