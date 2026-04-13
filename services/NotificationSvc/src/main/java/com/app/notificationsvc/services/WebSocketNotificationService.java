package com.app.notificationsvc.services;

import com.app.notificationsvc.entity.Notification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebSocketNotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendToUser(Long userId, Notification notification) {
        try {
            messagingTemplate.convertAndSendToUser(
                    userId.toString(),
                    "/queue/notifications",
                    notification);
            log.info("Sent real-time notification to user: {}", userId);
        } catch (Exception e) {
            log.error("Error sending WebSocket notification to user: {}", userId, e);
        }
    }

    public void sendUnreadCount(Long userId, Long count) {
        try {
            messagingTemplate.convertAndSendToUser(
                    userId.toString(),
                    "/queue/unread-count",
                    count);
        } catch (Exception e) {
            log.error("Error sending unread count to user: {}", userId, e);
        }
    }
}