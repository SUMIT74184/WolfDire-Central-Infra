package org.app.postsvcwolf.controllers;

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

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public ResponseEntity<PostResponse> createPost(
            @RequestBody CreatePostRequest request,
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader("X-User-Name") String username) {
        return new ResponseEntity<>(postService.createPost(request, userId, username), HttpStatus.CREATED);
    }

    @PostMapping("/{postId}/repost")
    public ResponseEntity<PostResponse> repost(
            @PathVariable String postId,
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader("X-User-Name") String username,
            @RequestParam(required = false) String additionalContent) {
        return new ResponseEntity<>(postService.repost(postId, userId, username, additionalContent), HttpStatus.CREATED);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostResponse> getPost(
            @PathVariable String postId,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        return ResponseEntity.ok(postService.getPost(postId, userId));
    }

    @GetMapping("/community/{communityId}")
    public ResponseEntity<Page<PostResponse>> getCommunityPosts(
            @PathVariable String communityId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(postService.getCommunityPosts(communityId, pageable, userId));
    }

    @GetMapping("/trending")
    public ResponseEntity<Page<PostResponse>> getTrendingPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(postService.getTrendingPosts(pageable, userId));
    }

    @GetMapping("/community/{communityId}/hot")
    public ResponseEntity<Page<PostResponse>> getHotPosts(
            @PathVariable String communityId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(postService.getHotPosts(communityId, pageable, userId));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<PostResponse>> searchPosts(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(postService.searchPosts(query, pageable, userId));
    }

    @GetMapping("/user/{targetUserId}")
    public ResponseEntity<Page<PostResponse>> getUserPosts(
            @PathVariable String targetUserId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(postService.getUserPosts(targetUserId, pageable, userId));
    }

    @PutMapping("/{postId}")
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable String postId,
            @RequestHeader("X-User-Id") String userId,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String content) {
        return ResponseEntity.ok(postService.updatePost(postId, userId, title, content));
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(
            @PathVariable String postId,
            @RequestHeader("X-User-Id") String userId) {
        postService.deletePost(postId, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{postId}/save")
    public ResponseEntity<Void> savePost(
            @PathVariable String postId,
            @RequestHeader("X-User-Id") String userId) {
        postService.savePost(userId, postId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{postId}/save")
    public ResponseEntity<Void> unsavePost(
            @PathVariable String postId,
            @RequestHeader("X-User-Id") String userId) {
        postService.unsavePost(userId, postId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/saved")
    public ResponseEntity<Page<PostResponse>> getSavedPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestHeader("X-User-Id") String userId) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(postService.getSavedPosts(userId, pageable));
    }
}
