package org.app.postsvcwolf.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.app.postsvcwolf.entity.Post;
import org.app.postsvcwolf.event.PostCreatedEvent;
import org.app.postsvcwolf.repository.PostRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIService {

    private final PostRepository postRepository;
    private final org.springframework.ai.embedding.EmbeddingModel embeddingModel;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${ai.enabled:false}")
    private boolean aiEnabled;

    @Value("${ai.openai.api-key:}")
    private String openAiApiKey;

    @Value("${ai.openai.model:gpt-4o-mini}")
    private String model;

    private static final Pattern HASHTAG_PATTERN = Pattern.compile("#([a-zA-Z0-9_]+)");

    @Async
    @KafkaListener(topics = "post.created", groupId = "ai-service-group")
    @Transactional
    public void processPostCreated(PostCreatedEvent event) {
        try {
            log.info("Processing post for AI enrichment: {}", event.getPostId());

            Optional<Post> postOpt = postRepository.findById(event.getPostId());
            if (postOpt.isEmpty()) {
                log.warn("Post not found: {}", event.getPostId());
                return;
            }

            Post post = postOpt.get();

            // --- Generate embedding (async, non-blocking for the user) ---
            try {
                String textToEmbed = post.getTitle() + " " + (post.getContent() != null ? post.getContent() : "");
                List<Double> embeddingList = embeddingModel.embed(textToEmbed);
                if (embeddingList != null && !embeddingList.isEmpty()) {
                    float[] embeddingArray = new float[embeddingList.size()];
                    for (int i = 0; i < embeddingList.size(); i++) {
                        embeddingArray[i] = embeddingList.get(i).floatValue();
                    }
                    post.setEmbedding(embeddingArray);
                    log.info("Embedding generated for post: {} ({} dimensions)", post.getId(), embeddingArray.length);
                } else {
                    log.warn("Embedding model returned null/empty for post: {}", post.getId());
                }
            } catch (Exception e) {
                log.error("Failed to generate embedding for post: {}", post.getId(), e);
            }

            // --- AI enrichment (summary, hashtags, spam, sentiment) ---
            if (aiEnabled && !openAiApiKey.isEmpty()) {
                String summary = generateSummary(post.getTitle(), post.getContent());
                post.setAiSummary(summary);

                double spamScore = detectSpam(post.getTitle(), post.getContent());
                post.setSpamScore(spamScore);

                if (spamScore > 0.8) {
                    post.setIsSpam(true);
                    log.warn("Post flagged as spam: {} (score: {})", post.getId(), spamScore);
                }

                double sentimentScore = analyzeSentiment(post.getTitle(), post.getContent());
                post.setSentimentScore(sentimentScore);
            }

            // --- Hashtag extraction (always runs, no API needed) ---
            Set<String> hashtags = extractHashtags(post.getTitle(), post.getContent());
            post.setHashtags(hashtags);

            postRepository.save(post);

            log.info("AI processing completed for post: {}", event.getPostId());

        } catch (Exception e) {
            log.error("Error processing post for AI enrichment: {}", event.getPostId(), e);
        }
    }

    private String generateSummary(String title, String content) {
        if (content == null || content.length() < 100) {
            return null;
        }

        try {
            String prompt = String.format(
                    "Summarize the following post in 2 sentences. Title: %s\nContent: %s",
                    title, content.substring(0, Math.min(content.length(), 1000))
            );

            Map<String, Object> request = new HashMap<>();
            request.put("model", model);
            request.put("messages", List.of(
                    Map.of("role", "system", "content", "You are a helpful assistant that summarizes content."),
                    Map.of("role", "user", "content", prompt)
            ));
            request.put("max_tokens", 100);
            request.put("temperature", 0.5);

            log.debug("Generating summary for post with title: {}", title);
            return "AI-generated summary would go here";

        } catch (Exception e) {
            log.error("Error generating summary", e);
            return null;
        }
    }

    private Set<String> extractHashtags(String title, String content) {
        Set<String> hashtags = new HashSet<>();

        try {
            String text = (title + " " + (content != null ? content : "")).toLowerCase();

            String[] keywords = {
                    "java", "python", "javascript", "programming", "coding",
                    "technology", "ai", "ml", "data", "web", "mobile",
                    "spring", "springboot", "microservices", "docker", "kubernetes",
                    "redis", "kafka", "postgres", "mongodb"
            };

            for (String keyword : keywords) {
                if (text.contains(keyword)) {
                    hashtags.add(keyword);
                }
            }

            Matcher matcher = HASHTAG_PATTERN.matcher(title + " " + (content != null ? content : ""));
            while (matcher.find()) {
                hashtags.add(matcher.group(1).toLowerCase());
            }

            return hashtags;

        } catch (Exception e) {
            log.error("Error extracting hashtags", e);
            return new HashSet<>();
        }
    }

    private double detectSpam(String title, String content) {
        try {
            String text = (title + " " + (content != null ? content : "")).toLowerCase();

            String[] spamKeywords = {
                    "click here", "buy now", "limited time", "act now",
                    "free money", "get rich", "make money fast", "weight loss",
                    "viagra", "casino", "lottery", "winner"
            };

            int spamCount = 0;
            for (String keyword : spamKeywords) {
                if (text.contains(keyword)) {
                    spamCount++;
                }
            }

            int excessiveCaps = 0;
            for (char c : title.toCharArray()) {
                if (Character.isUpperCase(c)) {
                    excessiveCaps++;
                }
            }

            double capsRatio = (double) excessiveCaps / title.length();

            int exclamationCount = text.length() - text.replace("!", "").length();

            double spamScore = 0.0;
            spamScore += (spamCount * 0.2);
            spamScore += (capsRatio > 0.5 ? 0.3 : 0);
            spamScore += (exclamationCount > 3 ? 0.2 : 0);

            return Math.min(spamScore, 1.0);

        } catch (Exception e) {
            log.error("Error detecting spam", e);
            return 0.0;
        }
    }

    private double analyzeSentiment(String title, String content) {
        try {
            String text = (title + " " + (content != null ? content : "")).toLowerCase();

            String[] positiveWords = {
                    "good", "great", "excellent", "awesome", "amazing",
                    "wonderful", "fantastic", "love", "best", "perfect"
            };

            String[] negativeWords = {
                    "bad", "terrible", "awful", "horrible", "hate",
                    "worst", "disgusting", "disappointing", "poor", "useless"
            };

            int positiveCount = 0;
            for (String word : positiveWords) {
                if (text.contains(word)) {
                    positiveCount++;
                }
            }

            int negativeCount = 0;
            for (String word : negativeWords) {
                if (text.contains(word)) {
                    negativeCount++;
                }
            }

            int total = positiveCount + negativeCount;
            if (total == 0) {
                return 0.5;
            }

            return (double) positiveCount / total;

        } catch (Exception e) {
            log.error("Error analyzing sentiment", e);
            return 0.5;
        }
    }
}