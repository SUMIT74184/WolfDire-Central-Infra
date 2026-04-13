package com.app.notificationsvc.repositories;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

import com.app.notificationsvc.entity.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdAndIsReadOrderByCreatedAtDesc(Long userId, Boolean isRead, Pageable pageable);

    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    Long countByUserIdAndIsRead(Long userId, Boolean isRead);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true, n.readAt = :readAt WHERE n.userId = :userId AND n.id IN :ids")
    void markAsRead(@Param("userId") Long userId, @Param("ids") List<Long> ids, @Param("readAt") LocalDateTime readAt);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true, n.readAt = :readAt WHERE n.userId = :userId AND n.isRead = false")
    void markAllAsRead(@Param("userId") Long userId, @Param("readAt") LocalDateTime readAt);

    @Query("SELECT n FROM Notification n WHERE n.createdAt < :cutoffDate")
    List<Notification> findOldNotifications(@Param("cutoffDate") LocalDateTime cutoffDate);

    List<Notification> findByAggregationKeyAndUserId(String aggregationKey, Long userId);

    @Query("SELECT n FROM Notification n WHERE n.isSent = false AND n.createdAt <= :threshold")
    List<Notification> findUnsentNotifications(@Param("threshold") LocalDateTime threshold, Pageable pageable);
}