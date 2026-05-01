package org.app.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.app.entity.FeedItem;
import org.app.entity.InteractionType;

import java.time.LocalDateTime;
import java.util.List;

public class FeedDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private List<FeedItemDTO> items;
        private int page;
        private int size;
        private int totalItems;
        private boolean hasMore;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FeedItemDTO{
        private String postId;
        private Long authorId;
        private Long communityId;
        private String title;
        private Double relevanceScore;
        private Double popularityScore;
        private Double finalScore;
        private LocalDateTime createdAt;
        private boolean read;
    }
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InteractionRequest{
        private Long userId;
        private String postId;
        private InteractionType type;
        private Integer durationSeconds;

    }


}
