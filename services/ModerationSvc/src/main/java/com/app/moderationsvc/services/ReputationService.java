package com.app.moderationsvc.services;

import com.app.moderationsvc.config.KafkaTopics;
import com.app.moderationsvc.entity.UserReputation;
import com.app.moderationsvc.repositories.UserReputationRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReputationService {

    private final UserReputationRepository userReputationRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final CacheManager cacheManager;

    @Value("${ai.reputation.initial-score}")
    private Double initialScore;

    @Value("${ai.reputation.min-score}")
    private Double minScore;

    @Value("${ai.reputation.max-score}")
    private Double maxScore;

    @Transactional
    @Cacheable(value = "userReputation", key = "#userId")
    public UserReputation getUserReputation(Long userId) {
        return userReputationRepository.findByUserId(userId)
                .orElseGet(() -> createInitialReputation(userId));
    }

    @Transactional
    public void recordContentCreation(Long userId, boolean flagged) {
        UserReputation reputation = getUserReputation(userId);

        reputation.setTotalPosts(reputation.getTotalPosts() + 1);

        if (flagged) {
            reputation.setFlaggedPosts(reputation.getFlaggedPosts() + 1);
            reputation.setLastViolationAt(LocalDateTime.now());

            updateTrustScore(reputation, -0.05);
        } else {
            updateTrustScore(reputation, 0.001);
        }

        saveReputation(reputation);
        publishReputationUpdate(reputation);
    }

    @Transactional
    public void recordContentRemoval(Long userId) {
        UserReputation reputation = getUserReputation(userId);

        reputation.setRemovedPosts(reputation.getRemovedPosts() + 1);
        reputation.setLastViolationAt(LocalDateTime.now());

        updateTrustScore(reputation, -0.1);

        if (reputation.getTrustScore() < 0.3) {
            reputation.setShadowBanned(true);
            log.warn("User {} shadow banned due to low trust score: {}", userId, reputation.getTrustScore());
        }

        saveReputation(reputation);
        publishReputationUpdate(reputation);
    }

    @Transactional
    public void recordUpvote(Long userId) {
        UserReputation reputation = getUserReputation(userId);

        reputation.setUpvotesReceived(reputation.getUpvotesReceived() + 1);
        updateTrustScore(reputation, 0.002);

        saveReputation(reputation);
    }

    @Transactional
    public void recordDownvote(Long userId) {
        UserReputation reputation = getUserReputation(userId);

        reputation.setDownvotesReceived(reputation.getDownvotesReceived() + 1);
        updateTrustScore(reputation, -0.001);

        saveReputation(reputation);
    }

    @Transactional
    public void recordReport(Long userId) {
        UserReputation reputation = getUserReputation(userId);

        reputation.setReportsReceived(reputation.getReportsReceived() + 1);
        updateTrustScore(reputation, -0.03);

        if (reputation.getReportsReceived() > 10 && reputation.getTrustScore() < 0.5) {
            reputation.setShadowBanned(true);
            log.warn("User {} shadow banned due to multiple reports", userId);
        }

        saveReputation(reputation);
        publishReputationUpdate(reputation);
    }

    @Transactional
    public void banUser(Long userId, boolean permanent) {
        UserReputation reputation = getUserReputation(userId);

        if (permanent) {
            reputation.setPermanentlyBanned(true);
            reputation.setTrustScore(0.0);
        } else {
            reputation.setShadowBanned(true);
        }

        saveReputation(reputation);
        publishReputationUpdate(reputation);

        log.info("User {} banned: permanent={}", userId, permanent);
    }

    public double calculateTrustScore(UserReputation reputation) {
        long totalContent = reputation.getTotalPosts() + reputation.getTotalComments();

        if (totalContent == 0) {
            return initialScore;
        }

        long flaggedContent = reputation.getFlaggedPosts() + reputation.getFlaggedComments();
        double flaggedRatio = (double) flaggedContent / totalContent;

        long removedContent = reputation.getRemovedPosts();
        double removalRatio = (double) removedContent / totalContent;

        long totalVotes = reputation.getUpvotesReceived() + reputation.getDownvotesReceived();
        double upvoteRatio = totalVotes > 0
                ? (double) reputation.getUpvotesReceived() / totalVotes
                : 0.5;

        double baseScore = 1.0;
        baseScore -= (flaggedRatio * 0.3);
        baseScore -= (removalRatio * 0.5);
        baseScore += ((upvoteRatio - 0.5) * 0.2);

        if (reputation.getReportsReceived() > 5) {
            baseScore -= 0.1;
        }

        return Math.max(minScore, Math.min(maxScore, baseScore));
    }

    private void updateTrustScore(UserReputation reputation, double delta) {
        double newScore = reputation.getTrustScore() + delta;
        newScore = Math.max(minScore, Math.min(maxScore, newScore));
        reputation.setTrustScore(newScore);
    }

    private UserReputation createInitialReputation(Long userId) {
        UserReputation reputation = UserReputation.builder()
                .userId(userId)
                .trustScore(initialScore)
                .build();

        saveReputation(reputation);
        log.info("Created initial reputation for user {}: score={}", userId, initialScore);

        return reputation;
    }

    private void publishReputationUpdate(UserReputation reputation) {
        Map<String, Object> event = new HashMap<>();
        event.put("userId", reputation.getUserId());
        event.put("trustScore", reputation.getTrustScore());
        event.put("shadowBanned", reputation.isShadowBanned());
        event.put("permanentlyBanned", reputation.isPermanentlyBanned());
        event.put("flaggedPosts", reputation.getFlaggedPosts());
        event.put("removedPosts", reputation.getRemovedPosts());

        kafkaTemplate.send(KafkaTopics.REPUTATION_UPDATED, event);

        log.debug("Published reputation update for user {}: trustScore={}",
                reputation.getUserId(), reputation.getTrustScore());
    }

    private UserReputation saveReputation(UserReputation reputation) {
        UserReputation saved = userReputationRepository.save(reputation);
        Cache cache = cacheManager.getCache("userReputation");
        if (cache != null) {
            cache.put(saved.getUserId(), saved);
        }
        return saved;
    }
}