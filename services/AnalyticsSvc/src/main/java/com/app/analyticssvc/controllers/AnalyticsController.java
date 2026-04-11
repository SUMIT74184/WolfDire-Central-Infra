package com.app.analyticssvc.controllers;

import com.app.analyticssvc.dto.AnalyticsResponse;
import com.app.analyticssvc.services.AnalyticsQueryService;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsQueryService queryService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<AnalyticsResponse> getUserAnalytics(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(queryService.getUserAnalytics(userId, startDate, endDate));
    }

    @GetMapping("/content/{contentId}")
    public ResponseEntity<AnalyticsResponse> getContentAnalytics(
            @PathVariable Long contentId,
            @RequestParam String contentType) {
        return ResponseEntity.ok(queryService.getContentAnalytics(contentId, contentType));
    }

    @GetMapping("/subreddit/{subredditId}")
    public ResponseEntity<AnalyticsResponse> getSubredditAnalytics(@PathVariable String subredditId) {
        return ResponseEntity.ok(queryService.getSubredditAnalytics(subredditId));
    }

    @GetMapping("/trending")
    public ResponseEntity<AnalyticsResponse> getTrendingTopics() {
        return ResponseEntity.ok(queryService.getTrendingTopics());
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AnalyticsResponse> getDashboard() {
        return ResponseEntity.ok(queryService.getDashboardMetrics());
    }
}