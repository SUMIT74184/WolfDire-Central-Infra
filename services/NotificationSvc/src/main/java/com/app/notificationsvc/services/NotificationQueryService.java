package com.app.notificationsvc.services;

import com.app.notificationsvc.dto.*;
import com.app.notificationsvc.entity.*;
import com.app.notificationsvc.repositories.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationQueryService {

    private final NotificationRepository notificationRepository;
    private final NotificationPreferenceRepository preferenceRepository;
    private final RedisTemplate<String, Object> redisTemplate;
    private final WebSocketNotificationService webSocketService;

    public Page<Notification> getUserNotifications(Long userId, int page, int size, Boolean unreadOnly) {
        Pageable pageable = PageRequest.of(page, size);

        List<Notification> results;
        if (Boolean.TRUE.equals(unreadOnly)) {
            results = notificationRepository.findByUserIdAndIsReadOrderByCreatedAtDesc(userId, false, pageable);
        } else {
            results = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        }

        return new PageImpl<>(results, pageable, results.size());
    }

    public UnreadCountResponse getUnreadCount(Long userId) {
        String cacheKey = "user:" + userId + ":unread";
        Object cached = redisTemplate.opsForValue().get(cacheKey);

        Long count;
        if (cached != null) {
            count = Long.parseLong(cached.toString());
        } else {
            count = notificationRepository.countByUserIdAndIsRead(userId, false);
            redisTemplate.opsForValue().set(cacheKey, count);
        }

        return new UnreadCountResponse(count);
    }

    @Transactional
    public void markAsRead(Long userId, List<Long> notificationIds) {
        notificationRepository.markAsRead(userId, notificationIds, LocalDateTime.now());

        updateUnreadCount(userId);
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsRead(userId, LocalDateTime.now());

        String cacheKey = "user:" + userId + ":unread";
        redisTemplate.opsForValue().set(cacheKey, 0L);

        webSocketService.sendUnreadCount(userId, 0L);
    }

    public NotificationPreference getPreferences(Long userId) {
        return preferenceRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultPreference(userId));
    }

    @Transactional
    public NotificationPreference updatePreferences(Long userId, NotificationPreference preferences) {
        NotificationPreference existing = preferenceRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultPreference(userId));

        existing.setEmailEnabled(preferences.getEmailEnabled());
        existing.setPushEnabled(preferences.getPushEnabled());
        existing.setWebsocketEnabled(preferences.getWebsocketEnabled());
        existing.setCommentNotifications(preferences.getCommentNotifications());
        existing.setReplyNotifications(preferences.getReplyNotifications());
        existing.setUpvoteNotifications(preferences.getUpvoteNotifications());
        existing.setMentionNotifications(preferences.getMentionNotifications());
        existing.setModerationNotifications(preferences.getModerationNotifications());
        existing.setFollowerNotifications(preferences.getFollowerNotifications());
        existing.setDigestEnabled(preferences.getDigestEnabled());
        existing.setDigestFrequency(preferences.getDigestFrequency());
        existing.setUpdatedAt(LocalDateTime.now());

        return preferenceRepository.save(existing);
    }

    @Transactional
    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    private void updateUnreadCount(Long userId) {
        Long count = notificationRepository.countByUserIdAndIsRead(userId, false);

        String cacheKey = "user:" + userId + ":unread";
        redisTemplate.opsForValue().set(cacheKey, count);

        webSocketService.sendUnreadCount(userId, count);
    }

    private NotificationPreference createDefaultPreference(Long userId) {
        NotificationPreference pref = new NotificationPreference();
        pref.setUserId(userId);
        return preferenceRepository.save(pref);
    }
}
