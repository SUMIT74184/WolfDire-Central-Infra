package com.app.analyticssvc.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ModerationEvent {
    private String eventId;
    private String eventType;
    private Long contentId;
    private String contentType;
    private Long moderatorId;
    private String action;
    private String reason;
    private Double toxicityScore;
    private LocalDateTime timestamp;
}
