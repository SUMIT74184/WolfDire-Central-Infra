package com.app.socialconnection.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "blocked_users",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"blockerId", "blockedId"})
        })
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlockedUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long blockerId;

    @Column(nullable = false)
    private Long blockedId;

    @Column(nullable = false)
    private LocalDateTime blockedAt;

    @Column
    private String reason;

    @PrePersist
    protected void onCreate() {
        blockedAt = LocalDateTime.now();
    }
}
