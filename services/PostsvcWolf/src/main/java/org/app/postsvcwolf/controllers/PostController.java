package org.app.postsvcwolf.controllers;


import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.app.postsvcwolf.Dto.CreatePostRequest;
import org.app.postsvcwolf.Dto.PostResponse;
import org.app.postsvcwolf.Entity.Vote;
import org.app.postsvcwolf.services.PostService;
import org.app.postsvcwolf.services.VoteService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;
    private final VoteService voteService;


    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostResponse> createPost(
            @Valid @ModelAttribute CreatePostRequest request,
            HttpServletRequest httpRequest
            ){
        String userId = (String)httpRequest.getAttribute("userId");
        String username = (String) httpRequest.getAttribute("username");

        PostResponse response = postService.createPost(request,userId,username);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    @PostMapping("/{postId}/repost")
    public ResponseEntity<PostResponse>repost(
            @PathVariable String postId,
            @RequestParam String subredditId,
            @RequestParam String subredditName,
            HttpServletRequest httpRequest
    ){
        String userId = (String) httpRequest.getAttribute("userId");
        String username = (String) httpRequest.getAttribute("username");

        PostResponse response = postService.repost(postId,userId,username,subredditId,subredditName);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostResponse> getPost(
            @PathVariable String postId,
            HttpServletRequest httpRequest
    ){
        String userId = (String) httpRequest.getAttribute("userId");
        PostResponse response = postService.getPost(postId,userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{postId}/view")
    public ResponseEntity<Void> incrementViewCount(@PathVariable String postId){
        postService.incrementViewCount(postId);
        return ResponseEntity.ok().build();

    }

    @GetMapping("/subreddit/{subredditId}")
    public ResponseEntity<Page<PostResponse>> getSubredditPosts(
            @PathVariable String subredditId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            HttpServletRequest httpRequest
    ){
        String userId = (String)httpRequest.getAttribute("userId");
        Pageable pageable = PageRequest.of(page,size);

        Page<PostResponse> posts = postService.getSubredditPosts(subredditId,pageable,userId);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/trending")
    public ResponseEntity<Page<PostResponse>> getTrendingPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            HttpServletRequest httpRequest
    ){
        String userId = (String) httpRequest.getAttribute("userId");
        Pageable pageable = PageRequest.of(page,size);

        Page<PostResponse> posts = postService.getTrendingPosts(pageable,userId);
        return ResponseEntity.ok(posts);
    }


    @GetMapping("/hot")
    public ResponseEntity<Page<PostResponse>> getHotPosts(
            @RequestParam String subredditId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            HttpServletRequest httpRequest) {

        String userId = (String) httpRequest.getAttribute("userId");
        Pageable pageable = PageRequest.of(page, size);

        Page<PostResponse> posts = postService.getHotPosts(subredditId, pageable, userId);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<PostResponse>> searchPosts(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            HttpServletRequest httpRequest) {

        String userId = (String) httpRequest.getAttribute("userId");
        Pageable pageable = PageRequest.of(page, size);

        Page<PostResponse> posts = postService.searchPosts(query, pageable, userId);
        return ResponseEntity.ok(posts);
    }

    @PutMapping("/{postId}")
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable String postId,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String content,
            HttpServletRequest httpRequest) {

        String userId = (String) httpRequest.getAttribute("userId");
        PostResponse response = postService.updatePost(postId, userId, title, content);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(
            @PathVariable String postId,
            HttpServletRequest httpRequest) {

        String userId = (String) httpRequest.getAttribute("userId");
        postService.deletePost(postId, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{postId}/upvote")
    public ResponseEntity<Void> upvotePost(
            @PathVariable String postId,
            HttpServletRequest httpRequest) {

        String userId = (String) httpRequest.getAttribute("userId");
        voteService.votePost(postId, userId, Vote.VoteType.UPVOTE);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{postId}/downvote")
    public ResponseEntity<Void> downvotePost(
            @PathVariable String postId,
            HttpServletRequest httpRequest) {

        String userId = (String) httpRequest.getAttribute("userId");
        voteService.votePost(postId, userId, Vote.VoteType.DOWNVOTE);
        return ResponseEntity.ok().build();
    }


}