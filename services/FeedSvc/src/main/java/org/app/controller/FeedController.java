package org.app.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.app.dto.FeedDTO;
import org.app.entity.InteractionType;
import org.app.services.FeedService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feed")
@RequiredArgsConstructor
public class FeedController {

    private final FeedService feedService;

    @GetMapping
    public ResponseEntity<FeedDTO.Response> getFeed(
            HttpServletRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        String userId = getUserId(request);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(feedService.getUserFeed(userId, page, size));
    }

    @GetMapping("/personalized")
    public ResponseEntity<FeedDTO.Response> getPersonalizedFeed(
            HttpServletRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        String userId = getUserId(request);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(feedService.getPersonalizedFeed(userId, page, size));
    }

    @PostMapping("/interact")
    public ResponseEntity<Void> trackInteraction(
            HttpServletRequest request,
            @RequestParam String postId,
            @RequestParam InteractionType type,
            @RequestParam(required = false) Integer durationSeconds) {

        String userId = getUserId(request);
        if (userId != null) {
            feedService.trackInteraction(userId, postId, type, durationSeconds);
        }
        return ResponseEntity.ok().build();
    }

    private String getUserId(HttpServletRequest request) {
        Object userId = request.getAttribute("userId");
        return userId != null ? (String) userId : null;
    }
}

