package com.app.notificationsvc.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "notification_aggregation", indexes = {
        @Index(name = "idx_agg_key", columnList = "aggregationKey,userId")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationAggregation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String aggregationKey;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Integer count = 0;

    @Column(columnDefinition = "jsonb")
    private String actorIds;

    @Column(nullable = false)
    private LocalDateTime firstEventAt;

    @Column(nullable = false)
    private LocalDateTime lastEventAt;

    private LocalDateTime sentAt;
}
