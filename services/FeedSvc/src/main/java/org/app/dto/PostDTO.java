package org.app.dto;


import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostDTO {
    private String id;
    private String title;
    private String content;
    private Long authorId;
    private Long communityId;
    private Long upvotes;
    private Long downvotes;
    private Long commentCount;
    private Long shareCount;
    private LocalDateTime createdAt;
}
