package com.app.notificationsvc.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarkReadRequest {
    private String userId;
    private List<Long> notificationIds;
}
