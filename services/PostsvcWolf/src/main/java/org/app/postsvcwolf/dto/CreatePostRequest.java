package org.app.postsvcwolf.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.app.postsvcwolf.entity.Post;
import org.springframework.web.multipart.MultipartFile;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePostRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 300, message = "Title must be between 3 and 300 characters")
    private String title;

    private String content;

    @NotBlank(message = "Community ID is required")
    private String communityId;

    @NotBlank(message = "Community name is required")
    private String communityName;

    @NotNull(message = "Post type is required")
    private Post.PostType type;

    private String linkUrl;

    private Boolean isNsfw;

    private Boolean isSpoiler;

    private MultipartFile mediaFile;
}
