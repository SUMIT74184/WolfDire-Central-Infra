package org.app.postsvcwolf.Dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;


@Data
public class CreateCommentRequest {

    @NotBlank(message = "Post ID is required")
    private String postId;

    @NotBlank(message = "Content is required")
    @Size(min = 1, max = 10000, message = "Content must be between 1 and 10000 characters")
    private String content;

    private String parentCommentId;

}
