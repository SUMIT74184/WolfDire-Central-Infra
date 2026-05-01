package org.app.postsvcwolf.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponse {
    private String id;
    private String postId;
    private String userId;
    private String username;
    private String content;
    private String parentCommentId;
    private Integer depth;
    private Set<String> mentions;
    private Long upvotes;
    private Long downvotes;
    private Long score;
    private Long replyCount;
    private Boolean isEdited;
    private String userVote;
    private List<CommentResponse> replies;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime editedAt;
}
