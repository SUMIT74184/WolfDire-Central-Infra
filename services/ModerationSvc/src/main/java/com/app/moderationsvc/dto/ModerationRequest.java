package com.app.moderationsvc.dto;

import com.app.moderationsvc.moderation.ContentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ModerationRequest {
    @NotBlank(message = "Content ID is required")
    private String contentId;
    
    @NotNull(message = "Content type is required")
    private ContentType contentType;
    
    @NotNull(message = "User ID is required")
    private Long userId;
    
    @NotBlank(message = "Content is required")
    private String content;
    
    @Builder.Default
    private Integer recentPostCount = 0;
}
