package com.app.analyticssvc.repositories;

import com.app.analyticssvc.Entity.TrendingTopic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TrendingTopicRepository extends JpaRepository<TrendingTopic, Long> {
    List<TrendingTopic> findByTimestampAfterOrderByTrendScoreDesc(LocalDateTime timestamp);

    TrendingTopic findByTopic(String topic);

    @Query("SELECT t FROM TrendingTopic t WHERE t.timestamp < :cutoffDate")
    List<TrendingTopic> findOldTopics(@Param("cutoffDate") LocalDateTime cutoffDate);
}
