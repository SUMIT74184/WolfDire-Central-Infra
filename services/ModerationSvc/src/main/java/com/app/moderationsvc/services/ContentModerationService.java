package com.app.moderationsvc.services;

import com.app.moderationsvc.dto.ModerationScores;
import com.app.moderationsvc.dto.SentimentResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class ContentModerationService {

    @Value("${openai.api.key:}")
    private String openAiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String MODERATION_URL = "https://api.openai.com/v1/moderations";

    public ModerationScores moderateContent(String content) {
        if (openAiApiKey != null && !openAiApiKey.isBlank() && !openAiApiKey.equals("demo")) {
            try {
                return callOpenAiModeration(content);
            } catch (Exception e) {
                log.error("Failed to call OpenAI Moderation API, falling back to mock", e);
            }
        }
        return getMockModeration(content);
    }

    @SuppressWarnings("unchecked")
    private ModerationScores callOpenAiModeration(String content) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openAiApiKey);

        Map<String, Object> request = Map.of(
                "model", "text-moderation-latest",
                "input", content
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(MODERATION_URL, entity, Map.class);
        
        Map<String, Object> body = response.getBody();
        if (body == null || !body.containsKey("results")) {
            throw new RuntimeException("Invalid response from OpenAI");
        }

        List<Map<String, Object>> results = (List<Map<String, Object>>) body.get("results");
        Map<String, Object> result = results.get(0);
        
        Map<String, Double> categoryScores = (Map<String, Double>) result.get("category_scores");
        boolean flagged = (Boolean) result.get("flagged");

        return ModerationScores.builder()
                .toxicityScore(categoryScores.getOrDefault("toxicity", 0.0))
                .hateSpeechScore(categoryScores.getOrDefault("hate", 0.0))
                .violenceScore(categoryScores.getOrDefault("violence", 0.0))
                .sexualScore(categoryScores.getOrDefault("sexual", 0.0))
                .harassmentScore(categoryScores.getOrDefault("harassment", 0.0))
                .selfHarmScore(categoryScores.getOrDefault("self-harm", 0.0))
                .spamScore(0.0) // Spam is evaluated locally
                .flagged(flagged)
                .build();
    }

    private ModerationScores getMockModeration(String content) {
        String lowerContent = content.toLowerCase();
        double toxicity = lowerContent.contains("hate") || lowerContent.contains("kill") ? 0.7 : 0.0;
        double sexual = lowerContent.contains("porn") || lowerContent.contains("sex") ? 0.6 : 0.0;
        
        return ModerationScores.builder()
                .toxicityScore(toxicity)
                .hateSpeechScore(toxicity)
                .sexualScore(sexual)
                .violenceScore(toxicity)
                .spamScore(0.0)
                .flagged(toxicity > 0.5 || sexual > 0.5)
                .build();
    }

    public boolean isSpam(String content, Long userId, Integer recentPostCount) {
        // Simple heuristic fallback
        return recentPostCount != null && recentPostCount > 10;
    }

    public String generateSummary(String content) {
        return "Auto-generated summary: " + (content.length() > 50 ? content.substring(0, 50) + "..." : content);
    }

    public SentimentResult analyzeSentiment(String content) {
        return SentimentResult.builder()
                .sentiment("NEUTRAL")
                .score(0.0)
                .build();
    }
}
