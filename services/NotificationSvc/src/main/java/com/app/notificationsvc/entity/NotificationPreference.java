package com.app.notificationsvc.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "notification_preferences", indexes = {
        @Index(name = "idx_user_pref", columnList = "userId")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationPreference {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long userId;

    private Boolean emailEnabled = true;
    private Boolean pushEnabled = true;
    private Boolean websocketEnabled = true;

    private Boolean commentNotifications = true;
    private Boolean replyNotifications = true;
    private Boolean upvoteNotifications = true;
    private Boolean mentionNotifications = true;
    private Boolean moderationNotifications = true;
    private Boolean followerNotifications = true;

    private Boolean digestEnabled = true;

    @Enumerated(EnumType.STRING)
    private DigestFrequency digestFrequency = DigestFrequency.DAILY;

    private LocalDateTime updatedAt;
}
