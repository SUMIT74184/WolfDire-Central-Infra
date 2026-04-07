package com.app.moderationsvc.services;

import com.app.moderationsvc.config.KafkaTopics;
import com.app.moderationsvc.dto.*;
import com.app.moderationsvc.entity.ModerationResult;
import com.app.moderationsvc.entity.UserReputation;
import com.app.moderationsvc.moderation.ModerationAction;
import com.app.moderationsvc.repositories.ModerationResultRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.PageRequest;

@Service
@RequiredArgsConstructor
@Slf4j
public class ModerationService {

    private final ModerationResultRepository moderationResultRepository;
    private final ContentModerationService contentModerationService;
    private final ReputationService reputationService;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${ai.moderation.toxicity-threshold}")
    private Double toxicityThreshold;

    @Value("${ai.moderation.spam-threshold}")
    private Double spamThreshold;

    @Value("${ai.moderation.auto-flag-threshold}")
    private Double autoFlagThreshold;

    @Transactional
    public ModerationResponse moderateContent(ModerationRequest request) {
        log.info("Moderating content: type={}, userId={}, contentId={}",
                request.getContentType(), request.getUserId(), request.getContentId());

        UserReputation reputation = reputationService.getUserReputation(request.getUserId());

        if (reputation.isPermanentlyBanned()) {
            return createRejectedResponse(request, "User is permanently banned");
        }

        ModerationScores scores = contentModerationService.moderateContent(request.getContent());

        boolean isSpam = contentModerationService.isSpam(
                request.getContent(),
                request.getUserId(),
                request.getRecentPostCount());

        double spamScoreValue = isSpam ? 0.9 : 0.1;

        ModerationAction action = determineAction(scores, spamScoreValue, reputation);

        ModerationResult result = ModerationResult.builder()
                .contentId(request.getContentId())
                .contentType(request.getContentType())
                .userId(request.getUserId())
                .toxicityScore(scores.getToxicityScore())
                .spamScore(spamScoreValue)
                .hateSpeechScore(scores.getHateSpeechScore())
                .violenceScore(scores.getViolenceScore())
                .sexualScore(scores.getSexualScore())
                .flagged(scores.isFlagged() || isSpam)
                .action(action)
                .reason(generateReason(scores, isSpam, reputation))
                .build();

        moderationResultRepository.save(result);

        boolean contentFlagged = result.isFlagged();
        reputationService.recordContentCreation(request.getUserId(), contentFlagged);

        if (action == ModerationAction.AUTO_REMOVED) {
            reputationService.recordContentRemoval(request.getUserId());
            publishContentRemovalEvent(request);
        }

        if (action == ModerationAction.SHADOW_BANNED) {
            reputationService.banUser(request.getUserId(), false);
        }

        String summary = null;
        String[] hashtags = null;
        SentimentResult sentiment = null;

        if (action == ModerationAction.APPROVED || action == ModerationAction.NO_ACTION) {
            summary = contentModerationService.generateSummary(request.getContent());
            sentiment = contentModerationService.analyzeSentiment(request.getContent());

            publishContentEnrichmentEvent(request, summary, sentiment);
        }

        return ModerationResponse.builder()
                .approved(action == ModerationAction.APPROVED || action == ModerationAction.NO_ACTION)
                .action(action)
                .toxicityScore(scores.getToxicityScore())
                .spamScore(spamScoreValue)
                .hateSpeechScore(scores.getHateSpeechScore())
                .violenceScore(scores.getViolenceScore())
                .sexualScore(scores.getSexualScore())
                .flagged(result.isFlagged())
                .reason(result.getReason())
                .trustScore(reputation.getTrustScore())
                .summary(summary)
                .sentiment(sentiment != null ? sentiment.getSentiment() : null)
                .build();
    }

    private ModerationAction determineAction(ModerationScores scores, double spamScore, UserReputation reputation) {
        if (reputation.isShadowBanned()) {
            return ModerationAction.SHADOW_BANNED;
        }

        if (scores.getToxicityScore() > autoFlagThreshold ||
                scores.getViolenceScore() > autoFlagThreshold ||
                scores.getSexualScore() > autoFlagThreshold) {
            return ModerationAction.AUTO_REMOVED;
        }

        if (scores.getToxicityScore() > toxicityThreshold ||
                spamScore > spamThreshold ||
                scores.getHateSpeechScore() > toxicityThreshold) {
            return ModerationAction.FLAGGED_FOR_REVIEW;
        }

        if (reputation.getTrustScore() < 0.3) {
            return ModerationAction.FLAGGED_FOR_REVIEW;
        }

        if (scores.isFlagged()) {
            return ModerationAction.FLAGGED_FOR_REVIEW;
        }

        return ModerationAction.APPROVED;
    }

    private String generateReason(ModerationScores scores, boolean isSpam, UserReputation reputation) {
        StringBuilder reason = new StringBuilder();

        if (scores.getToxicityScore() > toxicityThreshold) {
            reason.append("High toxicity detected. ");
        }

        if (scores.getHateSpeechScore() > toxicityThreshold) {
            reason.append("Hate speech detected. ");
        }

        if (scores.getViolenceScore() > toxicityThreshold) {
            reason.append("Violent content detected. ");
        }

        if (scores.getSexualScore() > toxicityThreshold) {
            reason.append("Sexual content detected. ");
        }

        if (isSpam) {
            reason.append("Spam indicators detected. ");
        }

        if (reputation.getTrustScore() < 0.3) {
            reason.append("Low user trust score. ");
        }

        if (reason.length() == 0) {
            return "Content approved";
        }

        return reason.toString().trim();
    }

    private ModerationResponse createRejectedResponse(ModerationRequest request, String reason) {
        return ModerationResponse.builder()
                .approved(false)
                .action(ModerationAction.AUTO_REMOVED)
                .flagged(true)
                .reason(reason)
                .trustScore(0.0)
                .build();
    }

    private void publishContentRemovalEvent(ModerationRequest request) {
        Map<String, Object> event = new HashMap<>();
        event.put("contentId", request.getContentId());
        event.put("contentType", request.getContentType());
        event.put("userId", request.getUserId());
        event.put("action", "REMOVE");
        event.put("timestamp", LocalDateTime.now());

        kafkaTemplate.send(KafkaTopics.CONTENT_MODERATED, event);

        log.info("Published content removal event: contentId={}", request.getContentId());
    }

    private void publishContentEnrichmentEvent(ModerationRequest request, String summary, SentimentResult sentiment) {
        Map<String, Object> event = new HashMap<>();
        event.put("contentId", request.getContentId());
        event.put("contentType", request.getContentType());
        event.put("summary", summary);
        event.put("sentiment", sentiment != null ? sentiment.getSentiment() : null);
        event.put("sentimentScore", sentiment != null ? sentiment.getScore() : null);

        kafkaTemplate.send(KafkaTopics.CONTENT_ENRICHED, event);

        log.debug("Published content enrichment event: contentId={}", request.getContentId());
    }

    public List<ModerationResult> getFlaggedContentQueue(int page, int size) {
        return moderationResultRepository.findByFlaggedTrueAndHumanReviewedFalseOrderByCreatedAtDesc(
                PageRequest.of(page, size)
        );
    }
}
