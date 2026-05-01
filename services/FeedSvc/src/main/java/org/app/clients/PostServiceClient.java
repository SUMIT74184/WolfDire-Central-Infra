package org.app.clients;

import org.app.dto.PostDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "post-service")
public interface PostServiceClient {

    @GetMapping("/api/posts/{postId}")
    PostDTO getPost(@PathVariable("postId") String postId);

    @GetMapping("/api/posts/{postId}/stats")
    PostDTO getPostStats(@PathVariable("postId") String postId);
}
