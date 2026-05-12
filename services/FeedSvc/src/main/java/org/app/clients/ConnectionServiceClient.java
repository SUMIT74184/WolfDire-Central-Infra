package org.app.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "SocialConnection")
public interface ConnectionServiceClient {

    @GetMapping("/api/connections/following/{userId}")
    List<String> getFollowingIds(@PathVariable("userId") String userId, @RequestParam("type") String type);

    @GetMapping("/api/connections/followers/{targetId}")
    List<String> getFollowerIds(@PathVariable("targetId") String targetId, @RequestParam("type") String type);
}
