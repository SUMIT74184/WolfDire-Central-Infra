package org.app.repository;

import org.app.entity.FeedItem;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface FeedItemRepository extends JpaRepository<FeedItem,Long> {
    Page<FeedItem> findByUserIdAndHiddenFalseOrderByCreatedAtDesc(
            Long userId, Pageable pageable);

    Page<FeedItem> findByUserIdAndHiddenFalseAndEmbeddingIsNotNullOrderByFinalScoreDesc(
            Long userId, Pageable pageable);

    List<FeedItem> findByPostId(String postId);

    @Query("SELECT fi FROM FeedItem fi WHERE fi.userId = :userId " +
            "AND fi.hidden = false " +
            "AND fi.createdAt > :since " +
            "ORDER BY fi.finalScore DESC")
    List<FeedItem> findRecentByUserIdOrderByScore(
            @Param("userId") Long userId,
            @Param("since") LocalDateTime since);

    @Query("SELECT COUNT(fi) FROM FeedItem fi WHERE fi.userId = :userId AND fi.read = false")
    Long countUnreadByUserId(@Param("userId") Long userId);

    void deleteByUserIdAndPostId(Long userId, String postId);

    @Modifying
    @Query("DELETE FROM FeedItem fi WHERE fi.createdAt < :cutoffDate")
    void deleteOlderThan(@Param("cutoffDate") LocalDateTime cutoffDate);

}
