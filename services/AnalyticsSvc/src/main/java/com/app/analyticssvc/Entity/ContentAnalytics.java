package com.app.analyticssvc.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "content_analytics", indexes = {
        @Index(name = "idx_content", columnList = "contentId,contentType"),
        @Index(name = "idx_date", columnList = "date")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContentAnalytics {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long contentId;

    @Column(nullable = false)
    private String contentType;

    @Column(nullable = false)
    private LocalDateTime date;

    private Integer viewCount;
    private Integer upvotes;
    private Integer downvotes;
    private Integer commentCount;
    private Integer shareCount;
    private Integer reportCount;
    private Double viralityScore;
    private Double controversyScore;
}
