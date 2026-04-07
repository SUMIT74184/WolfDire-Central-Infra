package com.app.socialconnection.Dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommunityDto {

    private Long id;
    private String name;
    private String description;
    private Long createdBy;
    private Long memberCount;
    private boolean active;

}
