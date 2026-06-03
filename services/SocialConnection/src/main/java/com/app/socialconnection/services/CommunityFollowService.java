package com.app.socialconnection.services;

import com.app.socialconnection.dto.ConnectionDTO;
import java.util.List;
import com.app.socialconnection.entity.CommunityFollower;
import com.app.socialconnection.repository.CommunityFollowerRepository;
import com.app.socialconnection.repository.CommunityRepository;
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

/**
 * 🎓 LEARNING: Community Follow Service
 *
 * This handles the "join/follow a community" feature (like Reddit's
 * r/subreddit).
 * It's separate from ConnectionService because communities ≠ users.
 *
 * Note the @Transactional(readOnly = true) on read methods:
 * - Tells Hibernate it doesn't need to track dirty changes
 * - Enables read-only DB connection pooling optimizations
 * - Results in better performance for SELECT queries
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CommunityFollowService {

    private final CommunityFollowerRepository communityFollowerRepository;
    private final CommunityRepository communityRepository;

    /**
     * Follow a community.
     */
    @Transactional
    @CacheEvict(value = "communityMemberCount", key = "#request.communityId")
    public CommunityFollower followCommunity(String userId, ConnectionDTO.FollowCommunityRequest request) {
        String communityId = request.getCommunityId();

        if (communityFollowerRepository.existsByCommunityIdAndUserId(communityId, userId)) {
            throw new DuplicateResourceException("You are already following this community");
        }

        CommunityFollower follower = CommunityFollower.builder()
                .communityId(communityId)
                .userId(userId)
                .notificationsEnabled(request.isEnabledNotifications())
                .build();

        follower = communityFollowerRepository.save(follower);
        communityRepository.incrementMemberCount(communityId);
        log.info("User {} followed community {}", userId, communityId);
        return follower;
    }

    /**
     * Admin/Moderator manually adds a member.
     */
    @Transactional
    @CacheEvict(value = "communityMemberCount", key = "#communityId")
    public CommunityFollower addMember(String requesterId, String communityId, String targetUserId, CommunityFollower.Role role) {
        CommunityFollower requester = communityFollowerRepository.findByCommunityIdAndUserId(communityId, requesterId)
                .orElseThrow(() -> new com.app.socialconnection.exception.UnauthorizedException("You are not a member of this community"));

        if (requester.getRole() == CommunityFollower.Role.MEMBER) {
            throw new com.app.socialconnection.exception.UnauthorizedException("Only Admins or Moderators can add members");
        }

        if (communityFollowerRepository.existsByCommunityIdAndUserId(communityId, targetUserId)) {
            throw new DuplicateResourceException("User is already in this community");
        }

        CommunityFollower follower = CommunityFollower.builder()
                .communityId(communityId)
                .userId(targetUserId)
                .notificationsEnabled(true)
                .role(role != null ? role : CommunityFollower.Role.MEMBER)
                .build();

        follower = communityFollowerRepository.save(follower);
        communityRepository.incrementMemberCount(communityId);
        log.info("Admin/Moderator {} added user {} to community {}", requesterId, targetUserId, communityId);
        return follower;
    }

    /**
     * Unfollow a community.
     */
    @Transactional
    @CacheEvict(value = "communityMemberCount", key = "#communityId")
    public void unfollowCommunity(String userId, String communityId) {
        CommunityFollower follower = communityFollowerRepository
                .findByCommunityIdAndUserId(communityId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("You are not following this community"));

        communityFollowerRepository.delete(follower);
        communityRepository.decrementMemberCount(communityId);
        log.info("User {} unfollowed community {}", userId, communityId);
    }

    /**
     * Get paginated list of followers for a community.
     */
    @Transactional(readOnly = true)
    public Page<CommunityFollower> getCommunityFollowers(String communityId, Pageable pageable) {
        return communityFollowerRepository.findByCommunityId(communityId, pageable);
    }

    /**
     * Get paginated list of communities a user follows.
     */
    @Transactional(readOnly = true)
    public Page<CommunityFollower> getUserCommunities(String userId, Pageable pageable) {
        return communityFollowerRepository.findByUserId(userId, pageable);
    }

    /**
     * Toggle notification preferences for a community.
     */
    @Transactional
    public CommunityFollower toggleNotifications(String userId, String communityId) {
        CommunityFollower follower = communityFollowerRepository
                .findByCommunityIdAndUserId(communityId, userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "You are not following community " + communityId));

        follower.setNotificationsEnabled(!follower.isNotificationsEnabled());
        follower = communityFollowerRepository.save(follower);
        log.info("User {} toggled notifications for community {} to {}",
                userId, communityId, follower.isNotificationsEnabled());
        return follower;
    }

    /**
     * Get the member count for a community.
     */
    @Cacheable(value = "communityMemberCount", key = "#communityId")
    @Transactional(readOnly = true)
    public long getCommunityMemberCount(String communityId) {
        return communityFollowerRepository.countByCommunityId(communityId);
    }

    @Transactional(readOnly = true)
    public boolean isFollowing(String userId, String communityId) {
        return communityFollowerRepository.existsByCommunityIdAndUserId(communityId, userId);
    }

    @Transactional(readOnly = true)
    public List<String> getFollowingIds(String userId) {
        return communityFollowerRepository.findCommunityIdsByUserId(userId);
    }

    @Transactional(readOnly = true)
    public List<String> getFollowerIds(String communityId) {
        return communityFollowerRepository.findUserIdsByCommunityId(communityId);
    }
}
