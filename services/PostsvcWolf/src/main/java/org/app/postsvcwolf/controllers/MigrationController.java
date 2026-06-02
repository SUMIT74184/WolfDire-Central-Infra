package org.app.postsvcwolf.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.app.postsvcwolf.entity.Post;
import org.app.postsvcwolf.repository.PostRepository;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/posts/migration")
@RequiredArgsConstructor
@Slf4j
public class MigrationController {

    private final PostRepository postRepository;
    private final EmbeddingModel embeddingModel;

    @PostMapping("/embeddings")
    public ResponseEntity<String> migrateEmbeddings() {
        List<Post> posts = postRepository.findAll();
        int count = 0;
        for (Post post : posts) {
            if (post.getEmbedding() == null) {
                try {
                    String textToEmbed = post.getTitle() + " " + (post.getContent() != null ? post.getContent() : "");
                    List<Double> embeddingList = embeddingModel.embed(textToEmbed);
                    if (embeddingList != null) {
                        float[] embeddingArray = new float[embeddingList.size()];
                        for (int i = 0; i < embeddingList.size(); i++) {
                            embeddingArray[i] = embeddingList.get(i).floatValue();
                        }
                        post.setEmbedding(embeddingArray);
                        postRepository.save(post);
                        count++;
                    }
                } catch (Exception e) {
                    log.error("Failed to migrate embedding for post {}", post.getId(), e);
                }
            }
        }
        return ResponseEntity.ok("Migrated embeddings for " + count + " posts.");
    }
}
