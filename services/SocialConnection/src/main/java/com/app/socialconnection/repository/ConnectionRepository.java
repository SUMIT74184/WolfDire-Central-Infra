package com.app.socialconnection.repository;

import com.app.socialconnection.entity.Connection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, Long> {

    Optional<Connection> findByUserIdAndFollowerId(Long userId, Long followerId);

    boolean existsByUserIdAndFollowerId(Long userId, Long followerId);

    // Get people who follow me (I am the userId, they are the followerId who sent the follow)
    Page<Connection> findByUserIdAndStatusAndType(Long userId, Connection.ConnectionStatus status,
                                                   Connection.ConnectionType type, Pageable pageable);

    // Get people I follow (I am the followerId)
    Page<Connection> findByFollowerIdAndStatusAndType(Long followerId, Connection.ConnectionStatus status,
                                                      Connection.ConnectionType type, Pageable pageable);

    // Get my pending incoming connection requests
    Page<Connection> findByUserIdAndStatus(Long userId, Connection.ConnectionStatus status, Pageable pageable);

    // Count followers
    long countByUserIdAndStatusAndType(Long userId, Connection.ConnectionStatus status,
                                       Connection.ConnectionType type);

    // Count following
    long countByFollowerIdAndStatusAndType(Long followerId, Connection.ConnectionStatus status,
                                            Connection.ConnectionType type);

    // Count pending requests
    long countByUserIdAndStatus(Long userId, Connection.ConnectionStatus status);

    // Delete a specific connection
    void deleteByUserIdAndFollowerId(Long userId, Long followerId);

    // Get follower IDs for a user (people who follow this userId)
    @Query("SELECT c.followerId FROM Connection c WHERE c.userId = :userId AND c.status = 'ACCEPTED'")
    List<Long> findFollowerIdsByUserId(Long userId);

    // Find all connections between two users (for cleanup when blocking)
    @Query("SELECT c FROM Connection c WHERE (c.userId = :userA AND c.followerId = :userB) " +
            "OR (c.userId = :userB AND c.followerId = :userA)")
    List<Connection> findAllConnectionsBetweenUsers(Long userA, Long userB);
}
