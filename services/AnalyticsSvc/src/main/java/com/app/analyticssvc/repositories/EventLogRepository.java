package com.app.analyticssvc.repositories;

import com.app.analyticssvc.Entity.EventLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventLogRepository extends JpaRepository<EventLog, Long> {
    List<EventLog> findByUserIdAndTimestampBetween(Long userId, LocalDateTime start, LocalDateTime end);

    List<EventLog> findByEventTypeAndTimestampAfter(String eventType, LocalDateTime timestamp);

    @Query("SELECT e FROM EventLog e WHERE e.timestamp < :cutoffDate")
    List<EventLog> findOldEvents(@Param("cutoffDate") LocalDateTime cutoffDate);
}