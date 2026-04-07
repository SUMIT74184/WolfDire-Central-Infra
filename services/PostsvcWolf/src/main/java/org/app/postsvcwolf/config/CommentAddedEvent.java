package org.app.postsvcwolf.config;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
public class CommentAddedEvent {
    private String commentId;
    private String postId;
    private String userId;
    private String username;
    private String content;
    private String parentCommentId;
    private Set<String> mentions;
    private LocalDateTime createdAt;
}
