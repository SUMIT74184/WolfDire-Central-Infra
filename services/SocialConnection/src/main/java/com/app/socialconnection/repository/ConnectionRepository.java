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

    Optional<Connection> findByUserIdAndFollowerId(String userId, String followerId);

    boolean existsByUserIdAndFollowerId(String userId, String followerId);

    // Get people who follow me (I am the userId, they are the followerId who sent the follow)
    Page<Connection> findByUserIdAndStatusAndType(String userId, Connection.ConnectionStatus status,
                                                   Connection.ConnectionType type, Pageable pageable);

    // Get people I follow (I am the followerId)
    Page<Connection> findByFollowerIdAndStatusAndType(String followerId, Connection.ConnectionStatus status,
                                                      Connection.ConnectionType type, Pageable pageable);

    // Get my pending incoming connection requests
    Page<Connection> findByUserIdAndStatus(String userId, Connection.ConnectionStatus status, Pageable pageable);

    // Count followers
    long countByUserIdAndStatusAndType(String userId, Connection.ConnectionStatus status,
                                       Connection.ConnectionType type);

    // Count following
    long countByFollowerIdAndStatusAndType(String followerId, Connection.ConnectionStatus status,
                                            Connection.ConnectionType type);

    // Count pending requests
    long countByUserIdAndStatus(String userId, Connection.ConnectionStatus status);

    // Delete a specific connection
    void deleteByUserIdAndFollowerId(String userId, String followerId);

    // Get follower IDs for a user (people who follow this userId)
    @Query("SELECT c.followerId FROM Connection c WHERE c.userId = :userId AND c.status = 'ACCEPTED'")
    List<String> findFollowerIdsByUserId(String userId);

    // Find all connections between two users (for cleanup when blocking)
    @Query("SELECT c FROM Connection c WHERE (c.userId = :userA AND c.followerId = :userB) " +
            "OR (c.userId = :userB AND c.followerId = :userA)")
    List<Connection> findAllConnectionsBetweenUsers(String userA, String userB);
}
