package com.app.socialconnection.repository;

import com.app.socialconnection.entity.CommunityFollower;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommunityFollowerRepository extends JpaRepository<CommunityFollower, String> {

    boolean existsByCommunityIdAndUserId(String communityId, String userId);

    Optional<CommunityFollower> findByCommunityIdAndUserId(String communityId, String userId);

    Page<CommunityFollower> findByCommunityId(String communityId, Pageable pageable);

    Page<CommunityFollower> findByUserId(String userId, Pageable pageable);

    long countByCommunityId(String communityId);

    // Get user IDs who follow a community
    @Query("SELECT cf.userId FROM CommunityFollower cf WHERE cf.communityId = :communityId")
    List<String> findUserIdsByCommunityId(String communityId);
}
