package com.app.moderationsvc.entity;

import com.app.moderationsvc.moderation.ContentType;
import com.app.moderationsvc.moderation.ModerationAction;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "moderation_results")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ModerationResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String contentId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContentType contentType;

    @Column(nullable = false)
    private Long userId;

    @Builder.Default
    private Double toxicityScore = 0.0;
    
    @Builder.Default
    private Double spamScore = 0.0;
    
    @Builder.Default
    private Double hateSpeechScore = 0.0;
    
    @Builder.Default
    private Double violenceScore = 0.0;
    
    @Builder.Default
    private Double sexualScore = 0.0;

    @Builder.Default
    private boolean flagged = false;

    @Enumerated(EnumType.STRING)
    private ModerationAction action;

    @Column(length = 1000)
    private String reason;

    private LocalDateTime createdAt;
    private LocalDateTime reviewedAt;
    private Long reviewedBy;
    
    @Builder.Default
    private boolean humanReviewed = false;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
