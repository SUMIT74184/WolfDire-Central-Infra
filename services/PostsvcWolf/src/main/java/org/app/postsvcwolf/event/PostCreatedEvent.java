package org.app.postsvcwolf.event;

import org.app.postsvcwolf.entity.Post;
import lombok.*;

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
    private String communityId;
    private String communityName;
    private Post.PostType type;
    private String mediaUrl;
    private Set<String> mentions;
    private LocalDateTime createdAt;
}
