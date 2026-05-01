package com.app.analyticssvc.repositories;

import com.app.analyticssvc.entity.CommunityAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CommunityAnalyticsRepository extends JpaRepository<CommunityAnalytics, Long> {
    CommunityAnalytics findByCommunityIdAndDate(String communityId, LocalDateTime date);

    @Query("SELECT s FROM SubredditAnalytics s WHERE s.date >= :startDate ORDER BY s.growthRate DESC")
    List<CommunityAnalytics> findFastestGrowing(@Param("startDate") LocalDateTime startDate);
}
