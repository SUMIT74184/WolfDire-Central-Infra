package com.app.notificationsvc.events;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoteEvent {
    private Long targetId;
    private String targetType;
    private Long targetAuthorId;
    private Long voterId;
    private String voterUsername;
    private Integer voteValue;
    private LocalDateTime timestamp;
}
