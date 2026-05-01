package org.app.postsvcwolf.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "user_id",nullable = false)
    private String userId;


    @Column(name = "target_id",nullable = false)
    private String targetId;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_type",nullable = false)
    private TargetType targetType;

    @Enumerated(EnumType.STRING)
    @Column(name = "vote_type",nullable = false)
    private VoteType voteType;

    @CreatedDate
    @Column(name = "created_at",nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum TargetType{
        POST,
        COMMENT
    }

    public enum VoteType{
        UPVOTE,
        DOWNVOTE
    }


}
