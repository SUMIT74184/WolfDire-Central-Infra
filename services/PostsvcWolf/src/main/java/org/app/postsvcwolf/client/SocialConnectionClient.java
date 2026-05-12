package org.app.postsvcwolf.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.Map;

@FeignClient(name = "SocialConnection")
public interface SocialConnectionClient {

    @GetMapping("/api/communities/{id}")
    Map<String, Object> getCommunityById(@PathVariable("id") String id);
}
