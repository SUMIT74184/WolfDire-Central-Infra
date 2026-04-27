package com.app.socialconnection.controllers;

import com.app.socialconnection.Dto.ConnectionDTO;
import com.app.socialconnection.Service.ConnectionService;
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
 * 🎓 LEARNING: REST Controller
 *
 * The Controller is the entry point for HTTP requests. It should be THIN:
 * - Extract data from the request (path variables, body, query params)
 * - Call the service layer
 * - Return the response
 *
 * Key annotations:
 * 
 * @RestController — Combines @Controller + @ResponseBody (auto-serializes to
 *                 JSON)
 * @RequestMapping — Base URL prefix for all endpoints in this controller
 * @RequiredArgsConstructor — Lombok injects ConnectionService via constructor
 *
 *                          How we get the authenticated userId:
 *                          The JwtAuthenticationFilter extracts userId from the
 *                          JWT token and sets it
 *                          as a request attribute. We read it with
 *                          request.getAttribute("userId").
 *
 *                          Pagination:
 *                          Spring Data's Pageable + @PageableDefault
 *                          auto-parses ?page=0&size=20&sort=createdAt,desc
 *                          from the URL query string. No manual parsing needed!
 */
@RestController
@RequestMapping("/api/social")
@RequiredArgsConstructor
public class ConnectionController {

    private final ConnectionService connectionService;

    // ==================== CONNECTION REQUESTS ====================

    @PostMapping("/request")
    public ResponseEntity<ConnectionDTO.ConnectionResponse> sendConnectionRequest(
            HttpServletRequest request,
            @Valid @RequestBody ConnectionDTO.ConnectionRequest connectionRequest) {
        Long userId = getUserId(request);
        ConnectionDTO.ConnectionResponse response = connectionService.sendConnectionRequest(userId, connectionRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<ConnectionDTO.ConnectionResponse> acceptConnection(
            HttpServletRequest request,
            @PathVariable Long id) {
        Long userId = getUserId(request);
        return ResponseEntity.ok(connectionService.acceptConnection(userId, id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ConnectionDTO.ConnectionResponse> rejectConnection(
            HttpServletRequest request,
            @PathVariable Long id) {
        Long userId = getUserId(request);
        return ResponseEntity.ok(connectionService.rejectConnection(userId, id));
    }

    // ==================== FOLLOW / UNFOLLOW ====================

    @PostMapping("/follow/{targetUserId}")
    public ResponseEntity<ConnectionDTO.ConnectionResponse> followUser(
            HttpServletRequest request,
            @PathVariable Long targetUserId) {
        Long userId = getUserId(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(connectionService.followUser(userId, targetUserId));
    }

    @DeleteMapping("/follow/{targetUserId}")
    public ResponseEntity<Void> unfollowUser(
            HttpServletRequest request,
            @PathVariable Long targetUserId) {
        Long userId = getUserId(request);
        connectionService.unfollowUser(userId, targetUserId);
        return ResponseEntity.noContent().build();
    }

    // ==================== QUERIES ====================

    @GetMapping("/followers")
    public ResponseEntity<Page<ConnectionDTO.ConnectionResponse>> getFollowers(
            HttpServletRequest request,
            @PageableDefault(size = 20) Pageable pageable) {
        Long userId = getUserId(request);
        return ResponseEntity.ok(connectionService.getFollowers(userId, pageable));
    }

    @GetMapping("/following")
    public ResponseEntity<Page<ConnectionDTO.ConnectionResponse>> getFollowing(
            HttpServletRequest request,
            @PageableDefault(size = 20) Pageable pageable) {
        Long userId = getUserId(request);
        return ResponseEntity.ok(connectionService.getFollowing(userId, pageable));
    }

    @GetMapping("/pending")
    public ResponseEntity<Page<ConnectionDTO.ConnectionResponse>> getPendingRequests(
            HttpServletRequest request,
            @PageableDefault(size = 20) Pageable pageable) {
        Long userId = getUserId(request);
        return ResponseEntity.ok(connectionService.getPendingRequests(userId, pageable));
    }

    @GetMapping("/stats")
    public ResponseEntity<ConnectionDTO.ConnectionStats> getConnectionStats(
            HttpServletRequest request) {
        Long userId = getUserId(request);
        return ResponseEntity.ok(connectionService.getConnectionStats(userId));
    }

    // ==================== BLOCK / UNBLOCK ====================

    @PostMapping("/block/{blockedUserId}")
    public ResponseEntity<Void> blockUser(
            HttpServletRequest request,
            @PathVariable Long blockedUserId,
            @RequestParam(required = false, defaultValue = "") String reason) {
        Long userId = getUserId(request);
        connectionService.blockUser(userId, blockedUserId, reason);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/block/{blockedUserId}")
    public ResponseEntity<Void> unblockUser(
            HttpServletRequest request,
            @PathVariable Long blockedUserId) {
        Long userId = getUserId(request);
        connectionService.unblockUser(userId, blockedUserId);
        return ResponseEntity.noContent().build();
    }
    // GET /api/social/blocked

    @GetMapping("/blocked")
    public ResponseEntity<Page<ConnectionDTO.BlockedUserResponse>> getBlockedUsers(
            HttpServletRequest request,
            @PageableDefault(size = 20) Pageable pageable) {
        Long userId = getUserId(request);
        return ResponseEntity.ok(connectionService.getBlockedUsers(userId, pageable));
    }

    // ==================== HELPER ====================

    private Long getUserId(HttpServletRequest request) {
        Object userId = request.getAttribute("userId");
        if (userId == null) {
            throw new IllegalArgumentException("User not authenticated — no userId found in request");
        }
        return (Long) userId;
    }
}
