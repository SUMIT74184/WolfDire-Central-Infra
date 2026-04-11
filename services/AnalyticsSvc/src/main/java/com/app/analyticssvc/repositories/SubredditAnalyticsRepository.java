package com.app.analyticssvc.repositories;

import com.app.analyticssvc.Entity.SubredditAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SubredditAnalyticsRepository extends JpaRepository<SubredditAnalytics, Long> {
    SubredditAnalytics findBySubredditIdAndDate(String subredditId, LocalDateTime date);

    @Query("SELECT s FROM SubredditAnalytics s WHERE s.date >= :startDate ORDER BY s.growthRate DESC")
    List<SubredditAnalytics> findFastestGrowing(@Param("startDate") LocalDateTime startDate);
}
