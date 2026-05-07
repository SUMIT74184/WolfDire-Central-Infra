package com.app.notificationsvc.events;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentEvent {
    private String commentId;
    private String postId;
    private String userId;
    private String username;
    private String parentCommentId;
    private String postAuthorId;
    private String content;
    private String action;
    private LocalDateTime timestamp;
}
