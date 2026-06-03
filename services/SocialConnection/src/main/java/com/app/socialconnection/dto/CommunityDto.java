package com.app.socialconnection.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommunityDto {

    private String id;
    private String name;
    private String slug;
    private String description;
    private String imageUrl;
    private String backgroundImageUrl;
    private String ownerId;
    private Long memberCount;
    private Long shareCount;
    private Boolean isArchived;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        private String name;
        private String description;
        /** Optional HTTPS image URL for banner / avatar */
        private String imageUrl;
        private String backgroundImageUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        private String description;
        private String imageUrl;
        private String backgroundImageUrl;
    }
}
