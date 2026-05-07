package com.app.notificationsvc.events;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MentionEvent {
    private String contentId;
    private String contentType;
    private String mentionedUserId;
    private String mentionerUserId;
    private String mentionerUsername;
    private String context;
    private LocalDateTime timestamp;
}
