package org.app.postsvcwolf.dto;

import lombok.Data;

@Data
public class UpdatePostRequest {
    private String title;
    private String content;
    private String category;
    private String mediaUrl;
}
