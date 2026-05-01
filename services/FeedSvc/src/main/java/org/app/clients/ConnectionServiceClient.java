package org.app.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "social-connection-service")
public interface ConnectionServiceClient {

    @GetMapping("/api/connections/following/{userId}")
    List<Long> getFollowingIds(@PathVariable("userId") Long userId, @RequestParam("type") String type);

    @GetMapping("/api/connections/followers/{targetId}")
    List<Long> getFollowerIds(@PathVariable("targetId") Long targetId, @RequestParam("type") String type);
}
