package com.app.socialconnection.controllers;

import com.app.socialconnection.Dto.ConnectionDTO;
import com.app.socialconnection.Entity.CommunityFollower;
import com.app.socialconnection.Service.CommunityFollowService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 🎓 LEARNING: Separate Controller per Domain
 *
 * We have ConnectionController for user-to-user connections and
 * CommunityFollowController for user-to-community follows.
 *
 * This follows the Single Responsibility Principle (SRP):
 * each controller handles one "resource type" / "feature area".
 */
@RestController
@RequestMapping("/api/communities")
@RequiredArgsConstructor
public class CommunityFollowController {

    private final CommunityFollowService communityFollowService;

    @PostMapping("/follow")
    public ResponseEntity<CommunityFollower> followCommunity(
            HttpServletRequest request,
            @Valid @RequestBody ConnectionDTO.FollowCommunityRequest followRequest) {
        Long userId = getUserId(request);
        CommunityFollower follower = communityFollowService.followCommunity(userId, followRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(follower);
    }

    @DeleteMapping("/follow/{communityId}")
    public ResponseEntity<Void> unfollowCommunity(
            HttpServletRequest request,
            @PathVariable Long communityId) {
        Long userId = getUserId(request);
        communityFollowService.unfollowCommunity(userId, communityId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{communityId}/followers")
    public ResponseEntity<Page<CommunityFollower>> getCommunityFollowers(
            @PathVariable Long communityId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(communityFollowService.getCommunityFollowers(communityId, pageable));
    }

    @GetMapping("/my-communities")
    public ResponseEntity<Page<CommunityFollower>> getUserCommunities(
            HttpServletRequest request,
            @PageableDefault(size = 20) Pageable pageable) {
        Long userId = getUserId(request);
        return ResponseEntity.ok(communityFollowService.getUserCommunities(userId, pageable));
    }

    @PutMapping("/{communityId}/notifications")
    public ResponseEntity<CommunityFollower> toggleNotifications(
            HttpServletRequest request,
            @PathVariable Long communityId) {
        Long userId = getUserId(request);
        return ResponseEntity.ok(communityFollowService.toggleNotifications(userId, communityId));
    }

    @GetMapping("/{communityId}/member-count")
    public ResponseEntity<Long> getCommunityMemberCount(@PathVariable Long communityId) {
        return ResponseEntity.ok(communityFollowService.getCommunityMemberCount(communityId));
    }

    private Long getUserId(HttpServletRequest request) {
        Object userId = request.getAttribute("userId");
        if (userId == null) {
            throw new IllegalArgumentException("User not authenticated — no userId found in request");
        }
        return (Long) userId;
    }
}
