package org.app.postsvcwolf.config;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.app.postsvcwolf.Entity.Post;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostCreatedEvent {

    private String postId;
    private String title;
    private String content;
    private String userId;
    private String username;
    private String subredditId;
    private String subredditName;
    private Post.PostType type;
    private String mediaUrl;
    private Set<String> mentions;
    private LocalDateTime createdAt;
}
