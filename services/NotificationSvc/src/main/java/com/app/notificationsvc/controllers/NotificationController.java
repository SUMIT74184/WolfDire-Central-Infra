package com.app.notificationsvc.controllers;

import com.app.notificationsvc.dto.*;
import com.app.notificationsvc.entity.*;

import com.app.notificationsvc.services.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationQueryService queryService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<Notification>> getUserNotifications(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Boolean unreadOnly) {
        return ResponseEntity.ok(queryService.getUserNotifications(userId, page, size, unreadOnly));
    }

    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<UnreadCountResponse> getUnreadCount(@PathVariable Long userId) {
        return ResponseEntity.ok(queryService.getUnreadCount(userId));
    }

    @PostMapping("/mark-read")
    public ResponseEntity<Void> markAsRead(@RequestBody MarkReadRequest request) {
        queryService.markAsRead(request.getUserId(), request.getNotificationIds());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/user/{userId}/mark-all-read")
    public ResponseEntity<Void> markAllAsRead(@PathVariable Long userId) {
        queryService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/preferences/{userId}")
    public ResponseEntity<NotificationPreference> getPreferences(@PathVariable Long userId) {
        return ResponseEntity.ok(queryService.getPreferences(userId));
    }

    @PutMapping("/preferences/{userId}")
    public ResponseEntity<NotificationPreference> updatePreferences(
            @PathVariable Long userId,
            @RequestBody NotificationPreference preferences) {
        return ResponseEntity.ok(queryService.updatePreferences(userId, preferences));
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long notificationId) {
        queryService.deleteNotification(notificationId);
        return ResponseEntity.ok().build();
    }
}