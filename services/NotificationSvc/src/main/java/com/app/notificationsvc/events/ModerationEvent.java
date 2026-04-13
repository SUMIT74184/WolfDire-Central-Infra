package com.app.notificationsvc.events;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ModerationEvent {
    private Long contentId;
    private String contentType;
    private Long contentAuthorId;
    private Long moderatorId;
    private String action;
    private String reason;
    private Double toxicityScore;
    private LocalDateTime timestamp;
}
