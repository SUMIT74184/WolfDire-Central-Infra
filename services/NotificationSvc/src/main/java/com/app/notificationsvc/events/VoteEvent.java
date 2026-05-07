package com.app.notificationsvc.events;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoteEvent {
    private String targetId;
    private String targetType;
    private String targetAuthorId;
    private String voterId;
    private String voterUsername;
    private Integer voteValue;
    private LocalDateTime timestamp;
}
