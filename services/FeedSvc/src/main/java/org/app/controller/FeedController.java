package org.app.controller;

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
            @RequestHeader(value = "X-User-Id", required = false) String userIdStr,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Long userId = (userIdStr != null && !userIdStr.isBlank()) ? Long.valueOf(userIdStr) : null;
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(feedService.getUserFeed(userId, page, size));
    }

    @GetMapping("/personalized")
    public ResponseEntity<FeedDTO.Response> getPersonalizedFeed(
            @RequestHeader(value = "X-User-Id", required = false) String userIdStr,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Long userId = (userIdStr != null && !userIdStr.isBlank()) ? Long.valueOf(userIdStr) : null;
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(feedService.getPersonalizedFeed(userId, page, size));
    }

    @PostMapping("/interact")
    public ResponseEntity<Void> trackInteraction(
            @RequestHeader(value = "X-User-Id", required = false) String userIdStr,
            @RequestParam String postId,
            @RequestParam InteractionType type,
            @RequestParam(required = false) Integer durationSeconds) {

        Long userId = (userIdStr != null && !userIdStr.isBlank()) ? Long.valueOf(userIdStr) : null;
        if (userId != null) {
            feedService.trackInteraction(userId, postId, type, durationSeconds);
        }
        return ResponseEntity.ok().build();
    }
}
