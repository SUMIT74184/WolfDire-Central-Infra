package com.app.socialconnection.Repository;

import com.app.socialconnection.Entity.BlockedUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BlockedUserRepository extends JpaRepository<BlockedUser, Long> {

    boolean existsByBlockerIdAndBlockedId(Long blockerId, Long blockedId);

    Optional<BlockedUser> findByBlockerIdAndBlockedId(Long blockerId, Long blockedId);

    org.springframework.data.domain.Page<BlockedUser> findByBlockerId(Long blockerId, org.springframework.data.domain.Pageable pageable);
}
