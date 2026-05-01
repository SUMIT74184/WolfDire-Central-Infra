package org.app.entity;


import com.pgvector.PGvector;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "feed_items",indexes = {
        @Index(name = "idx_user_created",columnList = "user_id,created_id"),
        @Index(name = "idx_post_id",columnList = "post_id"),
        @Index(name = "idx_created_desc",columnList = "created_at DESC")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedItem {

    @Id
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String postId;

    private Long communityId;

    private Long authorId;

    @Column(columnDefinition = "vector(1536)")
    private PGvector embedding;

    @Column(nullable = false)
    @Builder.Default
    private Double popularityScore = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private Double relevanceScore = 0.0;


    @Column(nullable = false)
    @Builder.Default
    private Double finalScore = 0.0;

    @CreationTimestamp
    private LocalDateTime createdAt;

    private LocalDateTime postCreatedAt;

    @Column(nullable = false)
    @Builder.Default
    private boolean read = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean hidden = false;



}
