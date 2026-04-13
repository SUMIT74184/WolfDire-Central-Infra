package com.app.notificationsvc.repositories;

import com.app.notificationsvc.entity.NotificationAggregation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationAggregationRepository extends JpaRepository<NotificationAggregation, Long> {
    Optional<NotificationAggregation> findByAggregationKeyAndUserIdAndSentAtIsNull(String aggregationKey, Long userId);

    List<NotificationAggregation> findBySentAtIsNullAndLastEventAtBefore(LocalDateTime threshold);
}
