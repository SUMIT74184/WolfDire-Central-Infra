package org.app.postsvcwolf.entity;


import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;


@Document(collection = "media")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Media {

    @Id
    private String id;

    @Indexed
    private String postId;

    @Indexed
    private String userId;

    private String fileName;

    private String fileType;

    private Long fileSize;

    private String s3Key;

    private String s3Url;

    private String thumbnailUrl;

    private MediaType mediaType;

    private Integer width;

    private Integer height;

    private Integer duration;

    private String format;

    private Map<String, Object> metadata;

    private ProcessingStatus processingStatus;

    private LocalDateTime uploadedAt;

    private LocalDateTime processedAt;

    public enum MediaType {
        IMAGE,
        VIDEO,
        GIF
    }

    public enum ProcessingStatus {
        PENDING,
        PROCESSING,
        COMPLETED,
        FAILED
    }

}
