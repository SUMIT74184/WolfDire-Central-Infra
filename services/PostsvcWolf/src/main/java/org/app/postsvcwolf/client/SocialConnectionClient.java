package org.app.postsvcwolf.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.Map;

@FeignClient(name = "social-connection") // Will route via discovery or ribbon
public interface SocialConnectionClient {

    @GetMapping("/api/communities/{id}")
    Map<String, Object> getCommunityById(@PathVariable("id") String id);
}
