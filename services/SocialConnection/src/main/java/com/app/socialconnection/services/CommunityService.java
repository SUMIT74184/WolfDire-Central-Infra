package com.app.socialconnection.services;

import com.app.socialconnection.dto.CommunityDto;
import com.app.socialconnection.entity.Community;
import com.app.socialconnection.repository.CommunityRepository;
import com.app.socialconnection.exception.DuplicateResourceException;
import com.app.socialconnection.exception.ResourceNotFoundException;
import com.app.socialconnection.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommunityService {

    private final CommunityRepository communityRepository;
    private final com.app.socialconnection.repository.CommunityFollowerRepository communityFollowerRepository;

    @Transactional
    public CommunityDto createCommunity(String userId, CommunityDto.CreateRequest request) {
        if (communityRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("Community with this name already exists");
        }
        
        String slug = generateSlug(request.getName());
        if (communityRepository.existsBySlug(slug)) {
            throw new DuplicateResourceException("Community URL slug already exists, try a different name");
        }

        Community community = Community.builder()
                .name(request.getName())
                .slug(slug)
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .backgroundImageUrl(request.getBackgroundImageUrl())
                .ownerId(userId)
                .memberCount(1L) // Founder is the first member
                .isArchived(false)
                .build();

        community = communityRepository.save(community);
        
        com.app.socialconnection.entity.CommunityFollower follower = com.app.socialconnection.entity.CommunityFollower.builder()
                .communityId(community.getId())
                .userId(userId)
                .notificationsEnabled(true)
                .role(com.app.socialconnection.entity.CommunityFollower.Role.ADMIN)
                .build();
        communityFollowerRepository.save(follower);
        
        log.info("User {} created and auto-joined community {}", userId, community.getName());
        return mapToDto(community);
    }

    @Transactional(readOnly = true)
    public CommunityDto getCommunityById(String id) {
        Community community = communityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Community not found"));
        return mapToDto(community);
    }

    @Transactional(readOnly = true)
    public CommunityDto getCommunityBySlug(String slug) {
        Community community = communityRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Community not found"));
        return mapToDto(community);
    }

    @Transactional(readOnly = true)
    public Page<CommunityDto> getAllCommunities(Pageable pageable) {
        return communityRepository.findByIsArchivedFalse(pageable)
                .map(this::mapToDto);
    }

    @Transactional
    public void incrementShareCount(String communityId) {
        communityRepository.incrementShareCount(communityId);
    }

    @Transactional
    public CommunityDto updateCommunity(String userId, String id, CommunityDto.UpdateRequest request) {
        Community community = communityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Community not found"));

        if (!community.getOwnerId().equals(userId)) {
            // Note: If you want moderators/admins to edit, you would check CommunityFollower role here instead of just ownerId
            throw new UnauthorizedException("Only the owner can edit this community");
        }

        if (request.getDescription() != null) {
            community.setDescription(request.getDescription());
        }
        if (request.getImageUrl() != null) {
            community.setImageUrl(request.getImageUrl());
        }
        if (request.getBackgroundImageUrl() != null) {
            community.setBackgroundImageUrl(request.getBackgroundImageUrl());
        }

        community = communityRepository.save(community);
        log.info("User {} updated community {}", userId, id);
        return mapToDto(community);
    }

    @Transactional
    public void archiveCommunity(String userId, String id) {
        Community community = communityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Community not found"));
        if (!community.getOwnerId().equals(userId)) {
            throw new UnauthorizedException("Only the owner can archive this community");
        }
        community.setIsArchived(true);
        communityRepository.save(community);
        log.info("User {} archived community {}", userId, id);
    }

    @Transactional
    public void deleteCommunity(String userId, String id) {
        Community community = communityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Community not found"));
        if (!community.getOwnerId().equals(userId)) {
            throw new UnauthorizedException("Only the owner can delete this community");
        }
        communityRepository.delete(community);
        log.info("User {} deleted community {}", userId, id);
    }

    private String generateSlug(String name) {
        return name.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
    }

    private CommunityDto mapToDto(Community community) {
        return CommunityDto.builder()
                .id(community.getId())
                .name(community.getName())
                .slug(community.getSlug())
                .description(community.getDescription())
                .imageUrl(community.getImageUrl())
                .backgroundImageUrl(community.getBackgroundImageUrl())
                .ownerId(community.getOwnerId())
                .memberCount(community.getMemberCount())
                .shareCount(community.getShareCount())
                .isArchived(community.getIsArchived())
                .build();
    }
}
