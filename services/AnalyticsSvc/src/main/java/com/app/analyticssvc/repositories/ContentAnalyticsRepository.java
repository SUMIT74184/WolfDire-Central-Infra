package com.app.analyticssvc.repositories;

import com.app.analyticssvc.entity.ContentAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ContentAnalyticsRepository extends JpaRepository<ContentAnalytics, Long> {
    ContentAnalytics findByContentIdAndContentTypeAndDate(Long contentId, String contentType, LocalDateTime date);

    @Query("SELECT c FROM ContentAnalytics c WHERE c.date >= :startDate AND c.contentType = :type ORDER BY c.viralityScore DESC")
    List<ContentAnalytics> findViralContent(@Param("startDate") LocalDateTime startDate, @Param("type") String type);

    @Query("SELECT c FROM ContentAnalytics c WHERE c.date >= :startDate ORDER BY c.controversyScore DESC")
    List<ContentAnalytics> findControversialContent(@Param("startDate") LocalDateTime startDate);
}
