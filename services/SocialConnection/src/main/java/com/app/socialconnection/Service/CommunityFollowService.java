package com.app.socialconnection.Service;

import com.app.socialconnection.Dto.ConnectionDTO;
import com.app.socialconnection.Entity.CommunityFollower;
import com.app.socialconnection.Repository.CommunityFollowerRepository;
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
 * This handles the "join/follow a community" feature (like Reddit's r/subreddit).
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

    /**
     * Follow a community.
     */
    @Transactional
    @CacheEvict(value = "communityMemberCount", key = "#request.communityId")
    public CommunityFollower followCommunity(Long userId, ConnectionDTO.FollowCommunityRequest request) {
        Long communityId = request.getCommunityId();

        if (communityFollowerRepository.existsByCommunityIdAndUserId(communityId, userId)) {
            throw new DuplicateResourceException("You are already following this community");
        }

        CommunityFollower follower = CommunityFollower.builder()
                .communityId(communityId)
                .userId(userId)
                .notificationsEnabled(request.isEnabledNotifications())
                .build();

        follower = communityFollowerRepository.save(follower);
        log.info("User {} followed community {}", userId, communityId);
        return follower;
    }

    /**
     * Unfollow a community.
     */
    @Transactional
    @CacheEvict(value = "communityMemberCount", key = "#communityId")
    public void unfollowCommunity(Long userId, Long communityId) {
        CommunityFollower follower = communityFollowerRepository
                .findByCommunityIdAndUserId(communityId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("You are not following this community"));

        communityFollowerRepository.delete(follower);
        log.info("User {} unfollowed community {}", userId, communityId);
    }

    /**
     * Get paginated list of followers for a community.
     */
    @Transactional(readOnly = true)
    public Page<CommunityFollower> getCommunityFollowers(Long communityId, Pageable pageable) {
        return communityFollowerRepository.findByCommunityId(communityId, pageable);
    }

    /**
     * Get paginated list of communities a user follows.
     */
    @Transactional(readOnly = true)
    public Page<CommunityFollower> getUserCommunities(Long userId, Pageable pageable) {
        return communityFollowerRepository.findByUserId(userId, pageable);
    }

    /**
     * Toggle notification preferences for a community.
     */
    @Transactional
    public CommunityFollower toggleNotifications(Long userId, Long communityId) {
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
    public long getCommunityMemberCount(Long communityId) {
        return communityFollowerRepository.countByCommunityId(communityId);
    }
}
