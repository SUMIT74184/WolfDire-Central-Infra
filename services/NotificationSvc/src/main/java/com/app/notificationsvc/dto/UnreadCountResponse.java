package com.app.notificationsvc.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UnreadCountResponse {
    private Long count;
}

@Data
@NoArgsConstructor
@AllArgsConstructor

class MarkReadRequest {
    private Long userId;
    private List<Long> notificationIds;
}