package com.app.socialconnection.Dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommunityDto {

    private Long id;
    private String name;
    private String slug;
    private String description;
    private Long ownerId;
    private Long memberCount;
    private boolean isArchived;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateRequest {
        private String name;
        private String description;
    }
}
