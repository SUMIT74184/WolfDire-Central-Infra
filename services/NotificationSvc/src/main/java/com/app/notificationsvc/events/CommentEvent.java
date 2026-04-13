package com.app.notificationsvc.events;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentEvent {
    private Long commentId;
    private Long postId;
    private Long userId;
    private String username;
    private Long parentCommentId;
    private Long postAuthorId;
    private String content;
    private String action;
    private LocalDateTime timestamp;
}
