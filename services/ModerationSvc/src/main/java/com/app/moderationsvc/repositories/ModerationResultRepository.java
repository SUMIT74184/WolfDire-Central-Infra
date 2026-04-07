package com.app.moderationsvc.repositories;

import com.app.moderationsvc.entity.ModerationResult;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModerationResultRepository extends JpaRepository<ModerationResult, Long> {
    
    List<ModerationResult> findByFlaggedTrueAndHumanReviewedFalseOrderByCreatedAtDesc(Pageable pageable);
}
