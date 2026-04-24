package org.app.postsvcwolf.Entity;


import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;


@Entity
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, length = 300)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "community_id", nullable = false)
    private String communityId;

    @Column(name = "community_name", nullable = false)
    private String communityName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PostType type;

    @Column(name = "media_url")
    private String mediaUrl;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @Column(name = "media_type")
    private String mediaType;


    private String aiSummary;

    @ElementCollection
    @CollectionTable(name = "post_hashtags" ,joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "hashtag")
    private Set<String> hashtags = new HashSet<>();


    @ElementCollection
    @CollectionTable(name = "post_mentions", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "mentioned_user")
    private Set<String> mentions = new HashSet<>();

    @Column(nullable = false)
    @Builder.Default
    private Long upVotes = 0L;

    @Column(nullable = false)
    @Builder.Default
    private Long downVotes = 0L;

    @Column(name = "comment_count",nullable = false)
    @Builder.Default
    private Long commentCount = 0L;

    @Column(nullable = false)
    @Builder.Default
    private Long score = 0L;

    @Column(name = "view_count", nullable = false)
    @Builder.Default
    private Long viewCount = 0L;

    @Column(name = "share_count", nullable = false)
    @Builder.Default
    private Long shareCount = 0L;

    @Column(name = "is_nsfw",nullable = false)
    @Builder.Default
    private Boolean isNsfw = false;


    @Column(name = "is_spoiler", nullable = false)
    @Builder.Default
    private Boolean isSpoiler = false;

    @Column(name = "is_locked", nullable = false)
    @Builder.Default
    private Boolean isLocked = false;

    @Column(name = "is_archived", nullable = false)
    @Builder.Default
    private Boolean isArchived = false;

    @Column(name = "is_removed", nullable = false)
    @Builder.Default
    private Boolean isRemoved = false;

    @Column(name = "is_spam", nullable = false)
    @Builder.Default
    private Boolean isSpam = false;

    @Column(name = "spam_score")
    private Double spamScore;

    @Column(name = "sentiment_score")
    private Double sentimentScore;

    @Column(name = "original_post_id")
    private String originalPostId;

    @Column(name = "is_repost", nullable = false)
    @Builder.Default
    private Boolean isRepost = false;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "edited_at")
    private LocalDateTime editedAt;


    public enum PostType{
        TEXT,
        IMAGE,
        VIDEO,
        LINK,
        POLL
    }



}
