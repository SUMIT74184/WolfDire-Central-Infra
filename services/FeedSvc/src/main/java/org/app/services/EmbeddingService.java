
package org.app.services;

import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.openai.OpenAiEmbeddingModel;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmbeddingService {

    @Value("${ai.openai.api-key}")
    private String apiKey;

    @Value("${ai.embedding.model}")
    private String modelName;

    private EmbeddingModel embeddingModel;


    public void init(){
        if(apiKey != null && !apiKey.equals("sk-test-key")){
            embeddingModel = OpenAiEmbeddingModel.builder()
                    .apiKey(apiKey)
                    .modelName(modelName)
                    .build();
            log.info("Initialized OpenAI embedding model: {}" , modelName);

        }else{
            log.warn("OpenAI API key not configured, using mock embedding");
        }
    }

    //made some changes here for Stream
    public float[] generateEmbedding(String text) {
        if (embeddingModel == null) {
            return generateMockEmbedding(text);
        }

        try {
            // .vector() directly returns the primitive float[]!
            return embeddingModel.embed(text).content().vector();

        } catch (Exception e) {
            log.error("Failed to generate embedding for text: {}", text, e);
            return generateMockEmbedding(text);
        }
    }

    private float[] generateMockEmbedding(String text) {
        int dimension = 1536;
        float[] embedding = new float[dimension];

        int hash = text.hashCode();
        for (int i = 0; i < dimension; i++) {
            embedding[i] = (float) Math.sin(hash + i) * 0.1f;
        }

        return embedding;
    }

    public String summarizePostContent(String title, String content) {
        if (content == null) content = "";
        String combined = title + " " + content;

        if (combined.length() > 500) {
            combined = combined.substring(0, 500);
        }

        return combined.trim();
    }
}
