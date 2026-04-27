package com.app.socialconnection.Service;

import com.app.socialconnection.Dto.ConnectionDTO;
import com.app.socialconnection.Entity.BlockedUser;
import com.app.socialconnection.Entity.Connection;
import com.app.socialconnection.Repository.BlockedUserRepository;
import com.app.socialconnection.Repository.ConnectionRepository;
import com.app.socialconnection.config.ConnectionRequestEvent;
import com.app.socialconnection.exception.BlockedUserException;
import com.app.socialconnection.exception.DuplicateResourceException;
import com.app.socialconnection.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 🎓 LEARNING: Service Layer
 *
 * The Service layer contains ALL the business logic. Controllers should be thin
 * (just receive requests and call services). This separation lets you:
 * - Reuse logic (e.g., the same service method called from REST + Kafka consumer)
 * - Test business logic independently of HTTP concerns
 * - Keep controllers clean and focused on request/response handling
 *
 * Key annotations:
 * @Service          — Marks this as a Spring-managed bean (auto-detected by component scan)
 * @RequiredArgsConstructor — Lombok generates a constructor for all 'final' fields (= dependency injection)
 * @Transactional    — Wraps the method in a DB transaction (auto-rollback on exception)
 * @Slf4j            — Lombok generates a 'log' field for logging
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ConnectionService {

    private final ConnectionRepository connectionRepository;
    private final BlockedUserRepository blockedUserRepository;
    private final KafkaProducerService kafkaProducerService;

    // ==================== CONNECTION REQUESTS ====================

    /**
     * Send a connection request (type = CONNECTION) to another user.
     * Creates a PENDING connection that the target user must accept/reject.
     */
    @Transactional
    @CacheEvict(value = "connectionStats", allEntries = true)
    public ConnectionDTO.ConnectionResponse sendConnectionRequest(Long userId, ConnectionDTO.ConnectionRequest request) {
        Long targetUserId = request.getTargetUserId();

        // Can't connect with yourself
        if (userId.equals(targetUserId)) {
            throw new IllegalArgumentException("Cannot send a connection request to yourself");
        }

        // Check if blocked
        checkNotBlocked(userId, targetUserId);

        // Check if connection already exists (in either direction)
        if (connectionRepository.existsByUserIdAndFollowerId(targetUserId, userId) ||
                connectionRepository.existsByUserIdAndFollowerId(userId, targetUserId)) {
            throw new DuplicateResourceException("A connection between these users already exists");
        }

        // Create the connection record
        // userId = the person RECEIVING the request, followerId = the person SENDING it
        Connection connection = Connection.builder()
                .userId(targetUserId)
                .followerId(userId)
                .status(Connection.ConnectionStatus.PENDING)
                .type(request.getType())
                .build();

        connection = connectionRepository.save(connection);
        log.info("Connection request sent: {} -> {} [type={}]", userId, targetUserId, request.getType());

        // Publish Kafka event so Notification Service can send a notification
        publishEvent(userId, targetUserId, request.getType().name(), "PENDING");

        return mapToResponse(connection);
    }

    /**
     * Accept an incoming connection request.
     */
    @Transactional
    @CacheEvict(value = "connectionStats", allEntries = true)
    public ConnectionDTO.ConnectionResponse acceptConnection(Long userId, Long connectionId) {
        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Connection", connectionId));

        // Only the target user (userId) can accept a request sent to them
        if (!connection.getUserId().equals(userId)) {
            throw new IllegalArgumentException("You can only accept requests sent to you");
        }

        if (connection.getStatus() != Connection.ConnectionStatus.PENDING) {
            throw new IllegalArgumentException("This connection is not in PENDING status");
        }

        connection.setStatus(Connection.ConnectionStatus.ACCEPTED);
        connection.setAcceptedAt(LocalDateTime.now());
        connection = connectionRepository.save(connection);

        log.info("Connection accepted: {} accepted request from {}", userId, connection.getFollowerId());
        publishEvent(userId, connection.getFollowerId(), connection.getType().name(), "ACCEPTED");

        return mapToResponse(connection);
    }

    /**
     * Reject an incoming connection request.
     */
    @Transactional
    @CacheEvict(value = "connectionStats", key = "#userId")
    public ConnectionDTO.ConnectionResponse rejectConnection(Long userId, Long connectionId) {
        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Connection", connectionId));

        if (!connection.getUserId().equals(userId)) {
            throw new IllegalArgumentException("You can only reject requests sent to you");
        }

        if (connection.getStatus() != Connection.ConnectionStatus.PENDING) {
            throw new IllegalArgumentException("This connection is not in PENDING status");
        }

        connection.setStatus(Connection.ConnectionStatus.REJECTED);
        connection = connectionRepository.save(connection);

        log.info("Connection rejected: {} rejected request from {}", userId, connection.getFollowerId());
        publishEvent(userId, connection.getFollowerId(), connection.getType().name(), "REJECTED");

        return mapToResponse(connection);
    }

    // ==================== FOLLOW / UNFOLLOW ====================

    /**
     * Follow another user. Unlike CONNECTION, FOLLOW is auto-accepted.
     * (Think Twitter's follow vs LinkedIn's connect)
     */
    @Transactional
    @CacheEvict(value = "connectionStats", allEntries = true)
    public ConnectionDTO.ConnectionResponse followUser(Long userId, Long targetUserId) {
        if (userId.equals(targetUserId)) {
            throw new IllegalArgumentException("Cannot follow yourself");
        }

        checkNotBlocked(userId, targetUserId);

        if (connectionRepository.existsByUserIdAndFollowerId(targetUserId, userId)) {
            throw new DuplicateResourceException("You are already following this user");
        }

        Connection connection = Connection.builder()
                .userId(targetUserId)       // The person being followed
                .followerId(userId)         // The person doing the following
                .status(Connection.ConnectionStatus.ACCEPTED)  // Auto-accepted
                .type(Connection.ConnectionType.FOLLOW)
                .acceptedAt(LocalDateTime.now())
                .build();

        connection = connectionRepository.save(connection);
        log.info("User {} followed user {}", userId, targetUserId);
        publishEvent(userId, targetUserId, "FOLLOW", "ACCEPTED");

        return mapToResponse(connection);
    }

    /**
     * Unfollow a user. Deletes the follow connection.
     */
    @Transactional
    @CacheEvict(value = "connectionStats", allEntries = true)
    public void unfollowUser(Long userId, Long targetUserId) {
        Connection connection = connectionRepository.findByUserIdAndFollowerId(targetUserId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("You are not following this user"));

        connectionRepository.delete(connection);
        log.info("User {} unfollowed user {}", userId, targetUserId);
    }

    // ==================== QUERIES ====================

    /**
     * Get paginated list of a user's followers.
     */
    @Transactional(readOnly = true)
    public Page<ConnectionDTO.ConnectionResponse> getFollowers(Long userId, Pageable pageable) {
        return connectionRepository
                .findByUserIdAndStatusAndType(userId, Connection.ConnectionStatus.ACCEPTED,
                        Connection.ConnectionType.FOLLOW, pageable)
                .map(this::mapToResponse);
    }

    /**
     * Get paginated list of users that a user is following.
     */
    @Transactional(readOnly = true)
    public Page<ConnectionDTO.ConnectionResponse> getFollowing(Long userId, Pageable pageable) {
        return connectionRepository
                .findByFollowerIdAndStatusAndType(userId, Connection.ConnectionStatus.ACCEPTED,
                        Connection.ConnectionType.FOLLOW, pageable)
                .map(this::mapToResponse);
    }

    /**
     * Get paginated list of pending incoming connection requests.
     */
    @Transactional(readOnly = true)
    public Page<ConnectionDTO.ConnectionResponse> getPendingRequests(Long userId, Pageable pageable) {
        return connectionRepository
                .findByUserIdAndStatus(userId, Connection.ConnectionStatus.PENDING, pageable)
                .map(this::mapToResponse);
    }

    /**
     * Get connection statistics for a user.
     */
    @Cacheable(value = "connectionStats", key = "#userId")
    @Transactional(readOnly = true)
    public ConnectionDTO.ConnectionStats getConnectionStats(Long userId) {
        long followersCount = connectionRepository.countByUserIdAndStatusAndType(
                userId, Connection.ConnectionStatus.ACCEPTED, Connection.ConnectionType.FOLLOW);
        long followingCount = connectionRepository.countByFollowerIdAndStatusAndType(
                userId, Connection.ConnectionStatus.ACCEPTED, Connection.ConnectionType.FOLLOW);
        long connectionsCount = connectionRepository.countByUserIdAndStatusAndType(
                userId, Connection.ConnectionStatus.ACCEPTED, Connection.ConnectionType.CONNECTION);
        long pendingCount = connectionRepository.countByUserIdAndStatus(
                userId, Connection.ConnectionStatus.PENDING);

        return ConnectionDTO.ConnectionStats.builder()
                .followersCount(followersCount)
                .followingCount(followingCount)
                .connectionsCount(connectionsCount)
                .pendingRequestsCount(pendingCount)
                .build();
    }

    // ==================== BLOCK / UNBLOCK ====================

    /**
     * Block a user. This also removes ALL existing connections between the two users.
     */
    @Transactional
    @CacheEvict(value = "connectionStats", allEntries = true)
    public void blockUser(Long userId, Long blockedId, String reason) {
        if (userId.equals(blockedId)) {
            throw new IllegalArgumentException("Cannot block yourself");
        }

        if (blockedUserRepository.existsByBlockerIdAndBlockedId(userId, blockedId)) {
            throw new DuplicateResourceException("User is already blocked");
        }

        // Create block record
        BlockedUser blockedUser = BlockedUser.builder()
                .blockerId(userId)
                .blockedId(blockedId)
                .reason(reason)
                .build();
        blockedUserRepository.save(blockedUser);

        // Remove all connections between the two users
        List<Connection> connections = connectionRepository.findAllConnectionsBetweenUsers(userId, blockedId);
        connectionRepository.deleteAll(connections);

        log.info("User {} blocked user {} (removed {} connections)", userId, blockedId, connections.size());

        // Publish block event
        ConnectionRequestEvent event = ConnectionRequestEvent.builder()
                .senderId(userId)
                .receiverId(blockedId)
                .type("BLOCK")
                .status("BLOCKED")
                .timestamp(LocalDateTime.now())
                .build();
        kafkaProducerService.publishBlockEvent(event);
    }

    /**
     * Unblock a user.
     */
    @Transactional
    public void unblockUser(Long userId, Long blockedId) {
        BlockedUser blockedUser = blockedUserRepository.findByBlockerIdAndBlockedId(userId, blockedId)
                .orElseThrow(() -> new ResourceNotFoundException("Block record not found"));

        blockedUserRepository.delete(blockedUser);
        log.info("User {} unblocked user {}", userId, blockedId);
    }

    @Transactional(readOnly = true)
    public Page<ConnectionDTO.BlockedUserResponse> getBlockedUsers(Long userId, Pageable pageable) {
        return blockedUserRepository.findByBlockerId(userId, pageable)
                .map(block -> ConnectionDTO.BlockedUserResponse.builder()
                        .id(block.getId())
                        .blockerId(block.getBlockerId())
                        .blockedId(block.getBlockedId())
                        .reason(block.getReason())
                        .blockedAt(block.getBlockedAt())
                        .build());
    }

    // ==================== HELPER METHODS ====================

    /**
     * Checks if either user has blocked the other.
     * Throws BlockedUserException if a block exists in either direction.
     */
    private void checkNotBlocked(Long userA, Long userB) {
        if (blockedUserRepository.existsByBlockerIdAndBlockedId(userA, userB)) {
            throw new BlockedUserException("You have blocked this user. Unblock them first.");
        }
        if (blockedUserRepository.existsByBlockerIdAndBlockedId(userB, userA)) {
            throw new BlockedUserException("This user has blocked you");
        }
    }

    private void publishEvent(Long senderId, Long receiverId, String type, String status) {
        ConnectionRequestEvent event = ConnectionRequestEvent.builder()
                .senderId(senderId)
                .receiverId(receiverId)
                .type(type)
                .status(status)
                .timestamp(LocalDateTime.now())
                .build();
        kafkaProducerService.publishConnectionEvent(event);
    }

    private ConnectionDTO.ConnectionResponse mapToResponse(Connection connection) {
        return ConnectionDTO.ConnectionResponse.builder()
                .id(connection.getId())
                .userId(connection.getUserId())
                .followerId(connection.getFollowerId())
                .status(connection.getStatus())
                .createdAt(connection.getCreatedAt())
                .acceptedAt(connection.getAcceptedAt())
                .build();
    }
}
