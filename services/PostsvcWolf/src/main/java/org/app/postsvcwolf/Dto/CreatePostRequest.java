package org.app.postsvcwolf.Dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.app.postsvcwolf.Entity.Post;
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

    @NotBlank(message = "Subreddit ID is required")
    private String subredditId;

    @NotBlank(message = "Subreddit name is required")
    private String subredditName;

    @NotNull(message = "Post type is required")
    private Post.PostType type;

    private String linkUrl;

    private Boolean isNsfw;

    private Boolean isSpoiler;

    private MultipartFile mediaFile;
}
