package org.app.postsvcwolf.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.app.postsvcwolf.Dto.CommentResponse;
import org.app.postsvcwolf.Dto.CreateCommentRequest;
import org.app.postsvcwolf.Entity.Vote;
import org.app.postsvcwolf.services.CommentService;
import org.app.postsvcwolf.services.VoteService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {
        private final CommentService commentService;
        private final VoteService voteService;

        @PostMapping
        public ResponseEntity<CommentResponse> createComment(
               @Valid @RequestBody CreateCommentRequest request,
                HttpServletRequest httpRequest
        ){
                String userId = (String)httpRequest.getAttribute("userId");
                String username = (String) httpRequest.getAttribute("username");


                CommentResponse response = commentService.createComment(request,userId,username);
                return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }
        @GetMapping("/post/{postId}")
        public ResponseEntity<Page<CommentResponse>> getPostComments(
                @PathVariable String postId,
                @RequestParam(defaultValue = "0") int page,
                @RequestParam(defaultValue = "50") int size,
                HttpServletRequest httpRequest
        ){

                String userId = (String) httpRequest.getAttribute("userId");
                Pageable pageable = PageRequest.of(page, size);

                Page<CommentResponse> comments = commentService.getPostComments(postId, pageable, userId);
                return ResponseEntity.ok(comments);


        }
        @GetMapping("/{commentId}/replies")
        public ResponseEntity<List<CommentResponse>> getCommentReplies(
               @PathVariable String commentId,
                HttpServletRequest httpRequest
        ){
                String userId = (String) httpRequest.getAttribute("userId");
                List<CommentResponse>replies = commentService.getCommentReplies(commentId,userId);
                return ResponseEntity.ok(replies);

        }

        @PutMapping("/{commentId}")
        public ResponseEntity<CommentResponse> updateComment(
                @PathVariable String commentId,
                @RequestParam String content,
                HttpServletRequest httpRequest) {

                String userId = (String) httpRequest.getAttribute("userId");
                CommentResponse response = commentService.updateComment(commentId, userId, content);
                return ResponseEntity.ok(response);
        }

        @DeleteMapping("/{commentId}")
        public ResponseEntity<Void> deleteComment(
                @PathVariable String commentId,
                HttpServletRequest httpRequest) {

                String userId = (String) httpRequest.getAttribute("userId");
                commentService.deleteComment(commentId, userId);
                return ResponseEntity.noContent().build();
        }

        @PostMapping("/{commentId}/upvote")
        public ResponseEntity<Void> upvoteComment(
                @PathVariable String commentId,
                HttpServletRequest httpRequest) {

                String userId = (String) httpRequest.getAttribute("userId");
                voteService.voteComment(commentId, userId, Vote.VoteType.UPVOTE);
                return ResponseEntity.ok().build();
        }

        @PostMapping("/{commentId}/downvote")
        public ResponseEntity<Void> downvoteComment(
                @PathVariable String commentId,
                HttpServletRequest httpRequest) {

                String userId = (String) httpRequest.getAttribute("userId");
                voteService.voteComment(commentId, userId, Vote.VoteType.DOWNVOTE);
                return ResponseEntity.ok().build();
        }


}
