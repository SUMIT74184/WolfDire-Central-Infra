package com.app.socialconnection.Repository;

import com.app.socialconnection.Entity.Community;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CommunityRepository extends JpaRepository<Community, Long> {

    Optional<Community> findBySlug(String slug);

    boolean existsByName(String name);

    boolean existsBySlug(String slug);

    Page<Community> findByOwnerId(Long ownerId, Pageable pageable);

    Page<Community> findByIsArchivedFalse(Pageable pageable);

    @Modifying
    @Query("UPDATE Community c SET c.memberCount = c.memberCount + 1 WHERE c.id = :communityId")
    void incrementMemberCount(@Param("communityId") Long communityId);

    @Modifying
    @Query("UPDATE Community c SET c.memberCount = c.memberCount - 1 WHERE c.id = :communityId")
    void decrementMemberCount(@Param("communityId") Long communityId);
}
