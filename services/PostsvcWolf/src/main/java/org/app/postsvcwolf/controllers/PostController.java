package org.app.postsvcwolf.controllers;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.app.postsvcwolf.dto.CreatePostRequest;
import org.app.postsvcwolf.dto.PostResponse;
import org.app.postsvcwolf.services.PostService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public ResponseEntity<PostResponse> createPost(
            @RequestBody CreatePostRequest request,
            HttpServletRequest httpRequest) {
        String userId = getRequiredUserId(httpRequest);
        String username = getUsername(httpRequest);
        return new ResponseEntity<>(postService.createPost(request, userId, username), HttpStatus.CREATED);
    }

    @PostMapping("/{postId}/repost")
    public ResponseEntity<PostResponse> repost(
            @PathVariable String postId,
            HttpServletRequest httpRequest,
            @RequestParam(required = false) String additionalContent) {
        String userId = getRequiredUserId(httpRequest);
        String username = getUsername(httpRequest);
        return new ResponseEntity<>(postService.repost(postId, userId, username, additionalContent), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPost(
            @PathVariable String id,
            HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(postService.getPost(id, userId));
    }

    @PostMapping("/batch")
    public ResponseEntity<List<PostResponse>> getPostsByIds(
            @RequestBody List<String> ids,
            HttpServletRequest request) {
        String userId = (String) request.getAttribute("userId");
        return ResponseEntity.ok(postService.getPostsByIds(ids, userId));
    }

    @GetMapping("/community/{communityId}")
    public ResponseEntity<Page<PostResponse>> getCommunityPosts(
            @PathVariable String communityId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            HttpServletRequest httpRequest) {
        String userId = getOptionalUserId(httpRequest);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(postService.getCommunityPosts(communityId, pageable, userId));
    }

    @GetMapping
    public ResponseEntity<Page<PostResponse>> listPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            HttpServletRequest httpRequest) {
        return getTrendingPosts(page, size, httpRequest);
    }

    @GetMapping("/trending")
    public ResponseEntity<Page<PostResponse>> getTrendingPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            HttpServletRequest httpRequest) {
        String userId = getOptionalUserId(httpRequest);
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(postService.getTrendingPosts(pageable, userId));
    }

    @GetMapping("/community/{communityId}/hot")
    public ResponseEntity<Page<PostResponse>> getHotPosts(
            @PathVariable String communityId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            HttpServletRequest httpRequest) {
        String userId = getOptionalUserId(httpRequest);
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(postService.getHotPosts(communityId, pageable, userId));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<PostResponse>> searchPosts(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            HttpServletRequest httpRequest) {
        String userId = getOptionalUserId(httpRequest);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(postService.searchPosts(query, pageable, userId));
    }

    @GetMapping("/user/{targetUserId}")
    public ResponseEntity<Page<PostResponse>> getUserPosts(
            @PathVariable String targetUserId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            HttpServletRequest httpRequest) {
        String userId = getOptionalUserId(httpRequest);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(postService.getUserPosts(targetUserId, pageable, userId));
    }

    @PutMapping("/{postId}")
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable String postId,
            @RequestBody org.app.postsvcwolf.dto.UpdatePostRequest request,
            HttpServletRequest httpRequest) {
        String userId = getRequiredUserId(httpRequest);
        return ResponseEntity.ok(postService.updatePost(postId, userId, request.getTitle(), request.getContent()));
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(
            @PathVariable String postId,
            HttpServletRequest httpRequest) {
        String userId = getRequiredUserId(httpRequest);
        postService.deletePost(postId, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{postId}/save")
    public ResponseEntity<Void> savePost(
            @PathVariable String postId,
            HttpServletRequest httpRequest) {
        String userId = getRequiredUserId(httpRequest);
        postService.savePost(userId, postId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{postId}/save")
    public ResponseEntity<Void> unsavePost(
            @PathVariable String postId,
            HttpServletRequest httpRequest) {
        String userId = getRequiredUserId(httpRequest);
        postService.unsavePost(userId, postId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/saved")
    public ResponseEntity<Page<PostResponse>> getSavedPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            HttpServletRequest httpRequest) {
        String userId = getRequiredUserId(httpRequest);
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(postService.getSavedPosts(userId, pageable));
    }

    // ── Helpers ──────────────────────────────────────────────────────────────────

    private String getRequiredUserId(HttpServletRequest request) {
        Object userId = request.getAttribute("userId");
        if (userId == null) {
            throw new IllegalArgumentException("User not authenticated — no userId found in request");
        }
        return (String) userId;
    }

    private String getOptionalUserId(HttpServletRequest request) {
        Object userId = request.getAttribute("userId");
        return userId != null ? (String) userId : null;
    }

    private String getUsername(HttpServletRequest request) {
        Object username = request.getAttribute("username");
        return username != null ? (String) username : "unknown";
    }
}

