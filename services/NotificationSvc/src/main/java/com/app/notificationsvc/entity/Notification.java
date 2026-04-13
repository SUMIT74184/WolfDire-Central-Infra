package com.app.notificationsvc.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications", indexes = {
        @Index(name = "idx_user_created", columnList = "userId,createdAt"),
        @Index(name = "idx_user_read", columnList = "userId,isRead"),
        @Index(name = "idx_aggregation_key", columnList = "aggregationKey")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String message;

    private Long actorId;
    private String actorUsername;
    private String actorAvatar;

    private Long targetId;

    @Enumerated(EnumType.STRING)
    private TargetType targetType;

    private String actionUrl;

    @Column(nullable = false)
    private Boolean isRead = false;

    private LocalDateTime readAt;

    @Column(nullable = false)
    private Boolean isSent = false;

    private LocalDateTime sentAt;

    private String aggregationKey;

    @Column(nullable = false)
    private Integer priority = 1;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(columnDefinition = "jsonb")
    private String metadata;
}
