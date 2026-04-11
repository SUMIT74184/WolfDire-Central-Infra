package com.app.analyticssvc.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostEvent {
    private String eventId;
    private String eventType;
    private Long postId;
    private Long userId;
    private String subredditId;
    private String action;
    private LocalDateTime timestamp;
    private String metadata;
}