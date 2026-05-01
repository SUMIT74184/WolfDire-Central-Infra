package org.app.postsvcwolf.dto;

import lombok.*;
import org.app.postsvcwolf.entity.Post;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostResponse {
    private String id;
    private String title;
    private String content;
    private String userId;
    private String username;
    private String communityId;
    private String communityName;
    private Post.PostType type;
    private String mediaUrl;
    private String thumbnailUrl;
    private String aiSummary;
    private Set<String> hashtags;
    private Set<String> mentions;
    private Long upvotes;
    private Long downvotes;
    private Long score;
    private Long commentCount;
    private Long viewCount;
    private Long shareCount;
    private Boolean isNsfw;
    private Boolean isSpoiler;
    private Boolean isLocked;
    private Boolean isArchived;
    private Boolean isRepost;
    private String originalPostId;
    private String userVote;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime editedAt;
}
