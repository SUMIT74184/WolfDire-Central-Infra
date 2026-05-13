package org.app.clients;

import org.app.dto.PostDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "PostsvcWolf")
public interface PostServiceClient {

    @GetMapping("/api/posts/{postId}")
    PostDTO getPost(@PathVariable("postId") String postId);

    @org.springframework.web.bind.annotation.PostMapping("/api/posts/batch")
    java.util.List<PostDTO> getPostsByIds(@org.springframework.web.bind.annotation.RequestBody java.util.List<String> ids);

    @GetMapping("/api/posts/{postId}/stats")
    PostDTO getPostStats(@PathVariable("postId") String postId);
}
