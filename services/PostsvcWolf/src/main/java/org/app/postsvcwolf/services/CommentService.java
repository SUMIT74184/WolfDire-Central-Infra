package org.app.postsvcwolf.services;

import org.app.postsvcwolf.entity.Vote;
import org.app.postsvcwolf.config.CommentAddedEvent;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.app.postsvcwolf.dto.CommentResponse;
import org.app.postsvcwolf.dto.CreateCommentRequest;
import org.app.postsvcwolf.entity.Comment;
import org.app.postsvcwolf.repository.CommentRepository;
import org.app.postsvcwolf.repository.PostRepository;
import org.app.postsvcwolf.repository.VoteRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final VoteRepository voteRepository;
    private final KafkaTemplate<String, Object>kafkaTemplate;

    private static final Pattern MENTION_PATTERN =  Pattern.compile("@([a-zA-Z0-9_]+)");
    private static final int MAX_COMMENT_DEPTH = 10;


    public CommentResponse createComment(CreateCommentRequest request,String userId,String username){
        postRepository.findActive(request.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));


        int depth = 0;
        if(request.getParentCommentId()!=null){
          Comment parentComment = commentRepository.findActive(request.getParentCommentId())
                  .orElseThrow(()->new RuntimeException("Parent comment not found"));

         depth = parentComment.getDepth() + 1;

         if(depth>MAX_COMMENT_DEPTH){
             throw new RuntimeException("Maximum comment depth exceeded");
         }

        }

        Set<String> mentions = extractMentions(request.getContent());

        Comment comment = Comment.builder()
                .postId(request.getPostId())
                .userId(userId)
                .username(username)
                .content(request.getContent())
                .parentCommentId(request.getParentCommentId())
                .depth(depth)
                .mentions(mentions)

                .build();


        comment = commentRepository.save(comment);

        postRepository.incrementCommentCount(request.getPostId());

        if (request.getParentCommentId()!= null){
            commentRepository.incrementReplyCount(request.getParentCommentId());
        }

        publishCommentAddedEvent(comment);

        // Publish mention events for each mentioned user
        if (comment.getMentions() != null && !comment.getMentions().isEmpty()) {
            for (String mentionedUser : comment.getMentions()) {
                publishMentionEvent(comment, mentionedUser);
            }
        }

        return mapToResponse(comment, userId);
    }

    @Cacheable(value = "comments", key = "#postId + '_' + #pageable.pageNumber")
    public Page<CommentResponse> getPostComments(String postId, Pageable pageable, String userId){
        Page<Comment> comments = commentRepository.findTopLevel(postId,pageable);
        return comments.map(comment -> mapToResponseWithReplies(comment,userId));


    }
    public List<CommentResponse> getCommentReplies(String commentId, String userId) {
        List<Comment> replies = commentRepository.findReplies(commentId);
        return replies.stream()
                .map(reply -> mapToResponseWithReplies(reply, userId))
                .collect(Collectors.toList());
    }

// Future no update of Comment will be allowed ----> or will be given as edited withing fixed window
    @Transactional
    @CacheEvict(value = {"comments", "posts"}, allEntries = true)
    public CommentResponse updateComment(String commentId, String userId, String content) {
        Comment comment = commentRepository.findActive(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to edit this comment");
        }

        comment.setContent(content);
        comment.setMentions(extractMentions(content));
        comment.setIsEdited(true);
        comment.setEditedAt(LocalDateTime.now());

        comment = commentRepository.save(comment);

        return mapToResponse(comment, userId);
    }


    public void deleteComment(String commentId,String userId){
        Comment comment = commentRepository.findActive(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this comment");
        }

        comment.setIsDeleted(true);
        comment.setContent("[deleted]");
        commentRepository.save(comment);
    }

    private Set<String> extractMentions(String content){
        if (content == null){
            return new HashSet<>();
        }

        Set<String> mentions =  new HashSet<>();
        Matcher matcher = MENTION_PATTERN.matcher(content);


        while(matcher.find()){
            mentions.add(matcher.group(1));

        }
        return mentions;
    }


    private void publishCommentAddedEvent(Comment comment){
        CommentAddedEvent event = CommentAddedEvent.builder()
                .commentId(comment.getId())
                .postId(comment.getPostId())
                .userId(comment.getUserId())
                .username(comment.getUsername())
                .content(comment.getContent())
                .parentCommentId(comment.getParentCommentId())
                .mentions(comment.getMentions())
                .createdAt(comment.getCreatedAt())
                .build();

        kafkaTemplate.send("comment.added", comment.getId(), event);
        log.info("Published comment added event for comment: {}", comment.getId());


    }

    private void publishMentionEvent(Comment comment, String mentionedUser) {
        try {
            java.util.Map<String, Object> event = new java.util.HashMap<>();
            event.put("commentId", comment.getId());
            event.put("postId", comment.getPostId());
            event.put("userId", comment.getUserId());
            event.put("username", comment.getUsername());
            event.put("mentionedUserId", mentionedUser);
            event.put("contentType", "COMMENT");
            event.put("createdAt", comment.getCreatedAt() != null ? comment.getCreatedAt().toString() : null);
            kafkaTemplate.send("user.mentioned", mentionedUser, event);
            log.info("Published user.mentioned event: {} mentioned in comment {}", mentionedUser, comment.getId());
        } catch (Exception e) {
            log.warn("Failed to publish mention event: {}", e.getMessage());
        }
    }

    private CommentResponse mapToResponse(Comment comment, String userId){
        String userVote = null;
        if(userId!=null){
            Optional<Vote>vote = voteRepository.findByUserAndTarget(
                    userId,comment.getId(),Vote.TargetType.COMMENT
            );
            userVote = vote.map(v->v.getVoteType().name()).orElse(null);
        }

        return CommentResponse.builder()
                .id(comment.getId())
                .postId(comment.getPostId())
                .userId(comment.getUserId())
                .username(comment.getUsername())
                .content(comment.getContent())
                .parentCommentId(comment.getParentCommentId())
                .depth(comment.getDepth())
                .mentions(comment.getMentions())
                .upvotes(comment.getUpvotes())
                .downvotes(comment.getDownvotes())
                .score(comment.getScore())
                .replyCount(comment.getReplyCount())
                .isEdited(comment.getIsEdited())
                .userVote(userVote)
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .editedAt(comment.getEditedAt())
                .build();
    }

    private CommentResponse mapToResponseWithReplies(Comment comment, String userId){
        CommentResponse response = mapToResponse(comment,userId);

        if(comment.getReplyCount()>0){
            List<CommentResponse> replies = getCommentReplies(comment.getId(),userId);
            response.setReplies(replies);
        }
        return response;
    }



}
