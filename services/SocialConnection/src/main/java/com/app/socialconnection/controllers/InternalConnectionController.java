package com.app.socialconnection.controllers;

import com.app.socialconnection.services.CommunityFollowService;
import com.app.socialconnection.services.ConnectionService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/connections")
@RequiredArgsConstructor
public class InternalConnectionController {

    private final ConnectionService connectionService;
    private final CommunityFollowService communityFollowService;

    @GetMapping("/following/{userId}")
    public List<String> getFollowingIds(@PathVariable String userId, @RequestParam String type) {
        if ("COMMUNITY".equalsIgnoreCase(type)) {
            return communityFollowService.getFollowingIds(userId);
        }
        return connectionService.getFollowingIds(userId, type);
    }

    @GetMapping("/followers/{targetId}")
    public List<String> getFollowerIds(@PathVariable String targetId, @RequestParam String type) {
        if ("COMMUNITY".equalsIgnoreCase(type)) {
            return communityFollowService.getFollowerIds(targetId);
        }
        return connectionService.getFollowerIds(targetId, type);
    }

    @GetMapping("/follow/{communityId}/check")
    public ResponseEntity<Boolean> isFollowingCommunity(
            HttpServletRequest request,
            @PathVariable String communityId) {
        String userId = getUserId(request);
        return ResponseEntity.ok(communityFollowService.isFollowing(userId, communityId));
    }

    private String getUserId(HttpServletRequest request) {
        Object userId = request.getAttribute("userId");
        return userId != null ? (String) userId : null;
    }
}
