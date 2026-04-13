package com.app.notificationsvc.events;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostEvent {
    private Long postId;
    private Long userId;
    private String username;
    private String title;
    private String subredditId;
    private String action;
    private LocalDateTime timestamp;
}
