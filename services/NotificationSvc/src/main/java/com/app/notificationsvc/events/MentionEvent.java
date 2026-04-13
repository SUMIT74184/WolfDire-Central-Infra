package com.app.notificationsvc.events;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MentionEvent {
    private Long contentId;
    private String contentType;
    private Long mentionedUserId;
    private Long mentionerUserId;
    private String mentionerUsername;
    private String context;
    private LocalDateTime timestamp;
}
