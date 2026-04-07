package com.app.socialconnection.Repository;

import com.app.socialconnection.Entity.CommunityFollower;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommunityFollowerRepository extends JpaRepository<CommunityFollower, Long> {

    boolean existsByCommunityIdAndUserId(Long communityId, Long userId);

    Optional<CommunityFollower> findByCommunityIdAndUserId(Long communityId, Long userId);

    Page<CommunityFollower> findByCommunityId(Long communityId, Pageable pageable);

    Page<CommunityFollower> findByUserId(Long userId, Pageable pageable);

    long countByCommunityId(Long communityId);

    // Get user IDs who follow a community
    @Query("SELECT cf.userId FROM CommunityFollower cf WHERE cf.communityId = :communityId")
    List<Long> findUserIdsByCommunityId(Long communityId);
}
