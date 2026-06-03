package org.app.postsvcwolf;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.ChatOptions;
import java.util.List;
import java.util.Collections;
import java.util.Map;
import java.util.ArrayList;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableFeignClients
@EnableJpaAuditing
@EnableAsync
public class PostSvcWolfApplication {

    public static void main(String[] args) {
        SpringApplication.run(PostSvcWolfApplication.class, args);
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public EmbeddingModel embeddingModel(RestTemplate restTemplate) {
        return new EmbeddingModel() {
            @Override
            public List<Double> embed(String document) {
                String apiKey = System.getenv("GEMINI_API_KEY");
                if (apiKey == null || apiKey.isEmpty()) {
                    return null;
                }
                
                String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=" + apiKey;
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                
                String body = "{\"model\": \"models/gemini-embedding-001\", \"content\": {\"parts\": [{\"text\": \"" + document.replace("\"", "\\\"").replace("\n", " ") + "\"}]}}";
                HttpEntity<String> entity = new HttpEntity<>(body, headers);
                
                try {
                    ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
                    Map<String, Object> bodyMap = response.getBody();
                    if (bodyMap != null && bodyMap.containsKey("embedding")) {
                        Map<String, Object> embeddingMap = (Map<String, Object>) bodyMap.get("embedding");
                        return (List<Double>) embeddingMap.get("values");
                    }
                } catch (Exception e) {
                    System.err.println("Error calling Gemini Embedding API: " + e.getMessage());
                }
                return null;
            }
            @Override
            public List<Double> embed(org.springframework.ai.document.Document document) {
                return embed(document.getContent());
            }
            @Override
            public org.springframework.ai.embedding.EmbeddingResponse call(org.springframework.ai.embedding.EmbeddingRequest request) {
                return null;
            }
        };
    }

    @Bean
    public ChatModel chatModel(RestTemplate restTemplate) {
        return new ChatModel() {
            @Override
            public ChatResponse call(Prompt prompt) {
                String apiKey = System.getenv("GEMINI_API_KEY");
                if (apiKey == null || apiKey.isEmpty()) {
                    return new ChatResponse(Collections.emptyList());
                }
                
                String textPrompt = prompt.getContents();
                String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=" + apiKey;
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                
                String body = "{\"contents\":[{\"parts\":[{\"text\":\"" + textPrompt.replace("\"", "\\\"").replace("\n", " ") + "\"}]}]}";
                HttpEntity<String> entity = new HttpEntity<>(body, headers);
                
                try {
                    ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
                    Map<String, Object> bodyMap = response.getBody();
                    if (bodyMap != null && bodyMap.containsKey("candidates")) {
                        List<Map<String, Object>> candidates = (List<Map<String, Object>>) bodyMap.get("candidates");
                        if (!candidates.isEmpty()) {
                            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                            if (!parts.isEmpty()) {
                                String textResponse = (String) parts.get(0).get("text");
                                org.springframework.ai.chat.model.Generation generation = new org.springframework.ai.chat.model.Generation(textResponse);
                                return new ChatResponse(Collections.singletonList(generation));
                            }
                        }
                    }
                } catch (Exception e) {
                    System.err.println("Error calling Gemini Chat API: " + e.getMessage());
                }
                
                return new ChatResponse(Collections.emptyList());
            }
            @Override
            public ChatOptions getDefaultOptions() {
                return null;
            }
        };
    }

}
