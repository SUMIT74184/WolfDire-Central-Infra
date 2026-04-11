package com.app.analyticssvc.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentEvent {
    private String eventId;
    private String eventType;
    private Long commentId;
    private Long postId;
    private Long userId;
    private String action;
    private LocalDateTime timestamp;
    private Integer depth;
}
