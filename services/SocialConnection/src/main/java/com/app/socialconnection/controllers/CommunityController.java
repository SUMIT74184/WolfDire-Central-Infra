package com.app.socialconnection.controllers;

import com.app.socialconnection.dto.CommunityDto;
import com.app.socialconnection.services.CommunityService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/communities")
@RequiredArgsConstructor
public class CommunityController {

    private final CommunityService communityService;

    @PostMapping
    public ResponseEntity<CommunityDto> createCommunity(
            HttpServletRequest request,
            @Valid @RequestBody CommunityDto.CreateRequest createRequest) {
        String userId = getUserId(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(communityService.createCommunity(userId, createRequest));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommunityDto> getCommunityById(@PathVariable String id) {
        return ResponseEntity.ok(communityService.getCommunityById(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<CommunityDto> updateCommunity(
            HttpServletRequest request,
            @PathVariable String id,
            @Valid @RequestBody CommunityDto.UpdateRequest updateRequest) {
        String userId = getUserId(request);
        return ResponseEntity.ok(communityService.updateCommunity(userId, id, updateRequest));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<CommunityDto> getCommunityBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(communityService.getCommunityBySlug(slug));
    }

    @GetMapping
    public ResponseEntity<Page<CommunityDto>> getAllCommunities(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(communityService.getAllCommunities(pageable));
    }

    @PostMapping("/{id}/share")
    public ResponseEntity<Void> shareCommunity(@PathVariable String id) {
        communityService.incrementShareCount(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/archive")
    public ResponseEntity<Void> archiveCommunity(HttpServletRequest request, @PathVariable String id) {
        String userId = getUserId(request);
        communityService.archiveCommunity(userId, id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCommunity(HttpServletRequest request, @PathVariable String id) {
        String userId = getUserId(request);
        communityService.deleteCommunity(userId, id);
        return ResponseEntity.noContent().build();
    }

    private String getUserId(HttpServletRequest request) {
        Object userId = request.getAttribute("userId");
        if (userId == null) {
            throw new IllegalArgumentException("User not authenticated — no userId found in request");
        }
        return (String) userId;
    }
}
