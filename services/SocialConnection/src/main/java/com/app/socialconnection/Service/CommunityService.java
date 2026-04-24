package com.app.socialconnection.Service;

import com.app.socialconnection.Dto.CommunityDto;
import com.app.socialconnection.Entity.Community;
import com.app.socialconnection.Repository.CommunityRepository;
import com.app.socialconnection.exception.DuplicateResourceException;
import com.app.socialconnection.exception.ResourceNotFoundException;
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

    @Transactional
    public CommunityDto createCommunity(Long userId, CommunityDto.CreateRequest request) {
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
                .ownerId(userId)
                .memberCount(1L) // Founder is the first member
                .isArchived(false)
                .build();

        community = communityRepository.save(community);
        log.info("User {} created community {}", userId, community.getName());
        return mapToDto(community);
    }

    @Transactional(readOnly = true)
    public CommunityDto getCommunityById(Long id) {
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

    private String generateSlug(String name) {
        return name.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
    }

    private CommunityDto mapToDto(Community community) {
        return CommunityDto.builder()
                .id(community.getId())
                .name(community.getName())
                .slug(community.getSlug())
                .description(community.getDescription())
                .ownerId(community.getOwnerId())
                .memberCount(community.getMemberCount())
                .isArchived(community.getIsArchived())
                .build();
    }
}
