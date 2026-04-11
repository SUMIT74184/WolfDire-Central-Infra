package com.app.analyticssvc.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoteEvent {
    private String eventId;
    private String eventType;
    private Long targetId;
    private String targetType;
    private Long userId;
    private Integer voteValue;
    private LocalDateTime timestamp;
}
