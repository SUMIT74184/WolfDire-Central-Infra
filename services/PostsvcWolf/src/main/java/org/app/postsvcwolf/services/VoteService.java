package org.app.postsvcwolf.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.app.postsvcwolf.entity.Vote;
import org.app.postsvcwolf.repository.CommentRepository;
import org.app.postsvcwolf.repository.PostRepository;
import org.app.postsvcwolf.repository.VoteRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;


@Service
@Slf4j
@RequiredArgsConstructor
public class VoteService {
    private final VoteRepository voteRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;


    @Transactional
    @CacheEvict(value = {"posts","comments","feed","trending","hot"},allEntries = true)
    public void votePost(String postId, String userId, Vote.VoteType voteType) {
        Optional<Vote> existingVote = voteRepository.findByUserAndTarget(
                userId, postId, Vote.TargetType.POST
        );
        if (existingVote.isPresent()) {
            Vote vote = existingVote.get();

            if (vote.getVoteType() == voteType) {
                removeVote(vote);
            } else {
                updateVote(vote, voteType);
            }
        } else {
            createVote(userId,postId,Vote.TargetType.POST,voteType);
        }
    }

    @Transactional
    @CacheEvict(value = {"comments", "posts"}, allEntries = true)
    public void voteComment(String commentId, String userId, Vote.VoteType voteType) {
        Optional<Vote> existingVote = voteRepository.findByUserAndTarget(
                userId, commentId, Vote.TargetType.COMMENT);

        if (existingVote.isPresent()) {
            Vote vote = existingVote.get();

            if (vote.getVoteType() == voteType) {
                removeVote(vote);
            } else {
                updateVote(vote, voteType);
            }
        } else {
            createVote(userId, commentId, Vote.TargetType.COMMENT, voteType);
        }
    }


    private void createVote(String userId, String targetId, Vote.TargetType targetType , Vote.VoteType voteType){
        Vote vote = Vote.builder()
                .userId(userId)
                .targetId(targetId)
                .targetType(targetType)
                .voteType(voteType)
                .build();

        voteRepository.save(vote);

        if(targetType == Vote.TargetType.POST){
            if(voteType == Vote.VoteType.UPVOTE){
                postRepository.incrementUpvotes(targetId);
            }else{
                postRepository.incrementDownvotes(targetId);
            }
        }else{
            if(voteType == Vote.VoteType.UPVOTE){
                commentRepository.incrementUpvotes(targetId);
            } else{
                commentRepository.incrementDownvotes(targetId);
            }
        }
        log.info("Created {} vote for {} {}",voteType,targetType,targetId);
        publishVoteEvent(userId, targetId, targetType, voteType, "CREATED");
    }

    private  void updateVote(Vote vote, Vote.VoteType newVoteType){
        Vote.VoteType oldVoteType = vote.getVoteType();
        vote.setVoteType(newVoteType);
        voteRepository.save(vote);
        if (vote.getTargetType() == Vote.TargetType.POST) {
            if (oldVoteType == Vote.VoteType.UPVOTE) {
                postRepository.decrementUpvotes(vote.getTargetId());
            } else {
                postRepository.decrementDownvotes(vote.getTargetId());
            }

            if (newVoteType == Vote.VoteType.UPVOTE) {
                postRepository.incrementUpvotes(vote.getTargetId());
            } else {
                postRepository.incrementDownvotes(vote.getTargetId());
            }
        } else {
            if (oldVoteType == Vote.VoteType.UPVOTE) {
                commentRepository.decrementUpvotes(vote.getTargetId());
            } else {
                commentRepository.decrementDownvotes(vote.getTargetId());
            }

            if (newVoteType == Vote.VoteType.UPVOTE) {
                commentRepository.incrementUpvotes(vote.getTargetId());
            } else {
                commentRepository.incrementDownvotes(vote.getTargetId());
            }
        }

        log.info("Updated vote from {} to {} for {} {}",
                oldVoteType,newVoteType,vote.getTargetType(),vote.getTargetType()
                );
        publishVoteEvent(vote.getUserId(), vote.getTargetId(), vote.getTargetType(), newVoteType, "UPDATED");
    }



        private void removeVote(Vote vote) {
            if (vote.getTargetType() == Vote.TargetType.POST) {
                if (vote.getVoteType() == Vote.VoteType.UPVOTE) {
                    postRepository.decrementUpvotes(vote.getTargetId());
                } else {
                    postRepository.decrementDownvotes(vote.getTargetId());
                }
            } else {
                if (vote.getVoteType() == Vote.VoteType.UPVOTE) {
                    commentRepository.decrementUpvotes(vote.getTargetId());
                } else {
                    commentRepository.decrementDownvotes(vote.getTargetId());
                }
            }

            voteRepository.delete(vote);

            log.info("Removed {} vote for {} {}",
                    vote.getVoteType(), vote.getTargetType(), vote.getTargetId());
            publishVoteEvent(vote.getUserId(), vote.getTargetId(), vote.getTargetType(), vote.getVoteType(), "REMOVED");
        }

    private void publishVoteEvent(String userId, String targetId, Vote.TargetType targetType,
                                  Vote.VoteType voteType, String action) {
        try {
            java.util.Map<String, Object> event = new java.util.HashMap<>();
            event.put("userId", userId);
            event.put("targetId", targetId);
            event.put("targetType", targetType.name());
            event.put("voteType", voteType.name());
            event.put("action", action);
            event.put("voteValue", voteType == Vote.VoteType.UPVOTE ? 1 : -1);
            kafkaTemplate.send("vote.changed", targetId, event);
            log.info("Published vote.changed event: {} {} for {} {}", action, voteType, targetType, targetId);
        } catch (Exception e) {
            log.warn("Failed to publish vote event: {}", e.getMessage());
        }
    }
}
