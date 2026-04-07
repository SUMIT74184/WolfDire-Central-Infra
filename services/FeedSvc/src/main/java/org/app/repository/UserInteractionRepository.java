package org.app.repository;


import org.app.entity.InteractionType;
import org.app.entity.UserInteraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface UserInteractionRepository extends JpaRepository<UserInteraction,Long> {

    List<UserInteraction> findByUserIdAndInteractionTypeIn(
            Long userId, List<InteractionType> types);

    List<UserInteraction> findByUserIdAndCreatedAtAfter(
            Long userId, LocalDateTime since);

    @Query("SELECT ui.postId FROM UserInteraction ui " +
            "WHERE ui.userId = :userId " +
            "AND ui.interactionType IN ('UPVOTE', 'COMMENT', 'SAVE') " +
            "ORDER BY ui.createdAt DESC")
    List<String> findEngagedPostIds(@Param("userId") Long userId);

    @Query("SELECT COUNT(ui) FROM UserInteraction ui " +
            "WHERE ui.postId = :postId " +
            "AND ui.interactionType = :type")
    Long countByPostIdAndType(
            @Param("postId") String postId,
            @Param("type") InteractionType type);

    boolean existsByUserIdAndPostIdAndInteractionType(
            Long userId, String postId, InteractionType type);
}
