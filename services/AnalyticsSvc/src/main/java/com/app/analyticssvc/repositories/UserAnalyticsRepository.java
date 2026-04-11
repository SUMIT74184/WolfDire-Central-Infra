package com.app.analyticssvc.repositories;

import com.app.analyticssvc.Entity.UserAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface UserAnalyticsRepository extends JpaRepository<UserAnalytics, Long> {
    UserAnalytics findByUserIdAndDate(Long userId, LocalDateTime date);

    List<UserAnalytics> findByUserIdAndDateBetween(Long userId, LocalDateTime start, LocalDateTime end);

    @Query("SELECT u FROM UserAnalytics u WHERE u.date >= :startDate ORDER BY u.engagementScore DESC")
    List<UserAnalytics> findTopEngagedUsers(@Param("startDate") LocalDateTime startDate);
}
