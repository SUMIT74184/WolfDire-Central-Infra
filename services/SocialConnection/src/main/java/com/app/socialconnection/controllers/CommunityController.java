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
        Long userId = getUserId(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(communityService.createCommunity(userId, createRequest));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommunityDto> getCommunityById(@PathVariable Long id) {
        return ResponseEntity.ok(communityService.getCommunityById(id));
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

    private Long getUserId(HttpServletRequest request) {
        Object userId = request.getAttribute("userId");
        if (userId == null) {
            throw new IllegalArgumentException("User not authenticated — no userId found in request");
        }
        return (Long) userId;
    }
}
