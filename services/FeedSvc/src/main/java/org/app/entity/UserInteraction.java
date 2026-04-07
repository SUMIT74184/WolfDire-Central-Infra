package org.app.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_interactions", indexes = {
        @Index(name = "idx_user_post", columnList = "user_id,post_id"),
        @Index(name = "idx_user_type", columnList = "user_id,interaction_type"),
        @Index(name = "idx_created", columnList = "created_at")
})

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserInteraction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String postId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InteractionType interactionType;

    @Column(nullable = false)
    @Builder.Default
    private Integer durationSeconds = 0;


    @CreationTimestamp
    private LocalDateTime createdAt;



}
