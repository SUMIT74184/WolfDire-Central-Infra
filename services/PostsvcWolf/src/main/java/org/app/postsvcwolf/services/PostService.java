package org.app.postsvcwolf.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.app.postsvcwolf.Dto.CreatePostRequest;
import org.app.postsvcwolf.Dto.PostResponse;
import org.app.postsvcwolf.Entity.Post;
import org.app.postsvcwolf.Entity.Vote;
import org.app.postsvcwolf.Event.PostCreatedEvent;
import org.app.postsvcwolf.repository.PostRepository;
import org.app.postsvcwolf.repository.VoteRepository;
import org.app.postsvcwolf.client.SocialConnectionClient;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashSet;
import org.springframework.data.redis.core.RedisTemplate;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostService {

    private final PostRepository postRepository;
    private final VoteRepository voteRepository;
    private final MediaService mediaService;
    private final SocialConnectionClient socialConnectionClient;
    private final RedisTemplate<String, String> redisTemplate;

    private final KafkaTemplate<String, Object> kafkaTemplate;

    private static final Pattern MENTION_PATTERN = Pattern.compile("@([a-zA-Z0-9_]+)");
    private static final int MAX_POSTS_PER_HOUR = 10;

    @Transactional
    @CacheEvict(value = {"feed", "trending", "hot"}, allEntries = true)
    public PostResponse createPost(CreatePostRequest request, String userId, String username) {
        validatePostLimit(userId);

        String cacheKey = "community_valid_" + request.getCommunityId();
        Boolean isValid = redisTemplate.hasKey(cacheKey);
        
        if (Boolean.FALSE.equals(isValid)) {
            try {
                socialConnectionClient.getCommunityById(request.getCommunityId());
                redisTemplate.opsForValue().set(cacheKey, "valid", Duration.ofHours(24));
            } catch (Exception e) {
                log.error("Failed to validate community existence for ID: {}", request.getCommunityId(), e);
                throw new RuntimeException("Community does not exist or validation failed");
            }
        }

        Set<String> mentions = extractMentions(request.getContent());

        Post post = Post.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .userId(userId)
                .username(username)
                .communityId(request.getCommunityId())
                .communityName(request.getCommunityName())
                .type(request.getType())
                .mentions(mentions)
                .isNsfw(request.getIsNsfw() != null ? request.getIsNsfw() : false)
                .isSpoiler(request.getIsSpoiler() != null ? request.getIsSpoiler() : false)
                .build();

        if (request.getType() == Post.PostType.LINK && request.getLinkUrl() != null) {
            post.setMediaUrl(request.getLinkUrl());
        }

        post = postRepository.save(post);


        //getting media,post,user and saving the post
        if (request.getMediaFile() != null && !request.getMediaFile().isEmpty()) {
            String mediaUrl = mediaService.uploadMedia(request.getMediaFile(), post.getId(), userId);
            post.setMediaUrl(mediaUrl);
            post = postRepository.save(post);
        }

        publishPostCreatedEvent(post);

        // Publish mention events for each mentioned user
        if (post.getMentions() != null && !post.getMentions().isEmpty()) {
            for (String mentionedUser : post.getMentions()) {
                publishMentionEvent(post, mentionedUser);
            }
        }

        return mapToResponse(post, userId);

    }

    @Transactional
    @CacheEvict(value = {"posts", "feed", "trending", "hot"}, allEntries = true)
    public PostResponse repost(String originalPostId, String userId, String username,
                               String communityId, String communityName) {

        Post originalPost = postRepository.findActive(originalPostId)
                .orElseThrow(() -> new RuntimeException("Original post not found"));

        Post repost = Post.builder()
                .title(originalPost.getTitle())
                .content(originalPost.getContent())
                .userId(userId)
                .username(username)
                .communityId(communityId)
                .communityName(communityName)
                .type(originalPost.getType())
                .mediaUrl(originalPost.getMediaUrl())
                .thumbnailUrl(originalPost.getThumbnailUrl())
                .isRepost(true)
                .originalPostId(originalPostId)
                .build();

        repost = postRepository.save(repost);
        postRepository.incrementShareCount(originalPostId);

        publishPostCreatedEvent(repost);

        return mapToResponse(repost, userId);

    }

    @Cacheable(value = "posts",key = "#postId")
    public PostResponse getPost(String postId,String userId){
        Post post = postRepository.findActive(postId)
                .orElseThrow(()->new RuntimeException("Post not found"));


        return mapToResponse(post,userId);
    }

    @Transactional
    public void incrementViewCount(String postId){
        postRepository.incrementViewCount(postId);
        publishViewEvent(postId);
    }

    @Cacheable(value = "feed", key = "#communityId + '_' + #pageable.pageNumber")
    public Page<PostResponse> getCommunityPosts(String communityId, Pageable pageable, String userId) {
        Page<Post> posts = postRepository.findByCommunity(communityId, pageable);
        return posts.map(post -> mapToResponse(post, userId));
    }

    @Cacheable(value = "trending", key = "'all_' + #pageable.pageNumber")
    public Page<PostResponse> getTrendingPosts(Pageable pageable,String userId){
        LocalDateTime since = LocalDateTime.now().minusHours(24);
        Page<Post> posts = postRepository.findTrending(since,pageable);
        return posts.map(post -> mapToResponse(post,userId));
    }

    @Cacheable(value = "hot", key = "#communityId + '_' + #pageable.pageNumber")
    public Page<PostResponse> getHotPosts(String communityId, Pageable pageable, String userId) {
        Page<Post> posts = postRepository.findHot(communityId, pageable);
        return posts.map(post -> mapToResponse(post, userId));

    }


    public Page<PostResponse> searchPosts(String query, Pageable pageable, String userId) {
        Page<Post> posts = postRepository.search(query, pageable);
        return posts.map(post -> mapToResponse(post, userId));
    }


    @Transactional
    @CacheEvict(value = {"posts", "feed"}, allEntries = true)
    public PostResponse updatePost(String postId, String userId, String title,
                                   String content
    ) {
        Post post = postRepository.findActive(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to edit this post");
        }

        if (post.getIsLocked()) {
            throw new RuntimeException("Post is locked");
        }

        if (title != null) {
            post.setTitle(title);
        }

        if (content != null) {
            post.setContent(content);
            post.setMentions(extractMentions(content));
        }

        post.setEditedAt(LocalDateTime.now());
        post = postRepository.save(post);


        return mapToResponse(post, userId);

    }


    public void deletePost(String postId, String userId) {
        Post post = postRepository.findActive(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this post");
        }

        post.setIsRemoved(true);
        postRepository.save(post);

    }

    private Set<String> extractMentions(String content) {
        if (content == null) {
            return new HashSet<>();
        }

        Set<String> mentions = new HashSet<>();
        Matcher matcher = MENTION_PATTERN.matcher(content);


        while (matcher.find()) {
            mentions.add(matcher.group(1));
        }
        return mentions;
    }

    private void validatePostLimit(String userId) {
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        Long recentPostCount = postRepository.countUserPostsSince(userId, oneHourAgo);

        if (recentPostCount >= MAX_POSTS_PER_HOUR) {
            throw new RuntimeException("Post limit exceeded.PLease wait before posting again");
        }
    }


    private void publishPostCreatedEvent(Post post) {
        PostCreatedEvent event = PostCreatedEvent.builder()
                .postId(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .userId(post.getUserId())
                .username(post.getUsername())
                .communityId(post.getCommunityId())
                .communityName(post.getCommunityName())
                .type(post.getType())
                .mediaUrl(post.getMediaUrl())
                .mentions(post.getMentions())
                .createdAt(post.getCreatedAt())
                .build();

        kafkaTemplate.send("post.created", post.getId(), event);
        log.info("Published post created event for post: {}", post.getId());

    }

    private void publishMentionEvent(Post post, String mentionedUser) {
        try {
            java.util.Map<String, Object> event = new java.util.HashMap<>();
            event.put("postId", post.getId());
            event.put("userId", post.getUserId());
            event.put("username", post.getUsername());
            event.put("mentionedUserId", mentionedUser);
            event.put("contentType", "POST");
            event.put("createdAt", post.getCreatedAt() != null ? post.getCreatedAt().toString() : null);
            kafkaTemplate.send("user.mentioned", mentionedUser, event);
            log.info("Published user.mentioned event: {} mentioned in post {}", mentionedUser, post.getId());
        } catch (Exception e) {
            log.warn("Failed to publish mention event: {}", e.getMessage());
        }
    }

    private void publishViewEvent(String postId) {
        try {
            java.util.Map<String, Object> event = new java.util.HashMap<>();
            event.put("postId", postId);
            event.put("eventType", "VIEW");
            event.put("timestamp", java.time.LocalDateTime.now().toString());
            kafkaTemplate.send("post.viewed", postId, event);
        } catch (Exception e) {
            log.warn("Failed to publish view event: {}", e.getMessage());
        }
    }

    private PostResponse mapToResponse(Post post,String userId){
        String userVote = null;
        if(userId!=null){
            Optional<Vote>vote = voteRepository.findByUserAndTarget(
                    userId, post.getId(), Vote.TargetType.POST
            );
            userVote = vote.map(v->v.getVoteType().name()).orElse(null);
        }

        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .userId(post.getUserId())
                .username(post.getUsername())
                .communityId(post.getCommunityId())
                .communityName(post.getCommunityName())
                .type(post.getType())
                .mediaUrl(post.getMediaUrl())
                .thumbnailUrl(post.getThumbnailUrl())
                .aiSummary(post.getAiSummary())
                .hashtags(post.getHashtags())
                .mentions(post.getMentions())
                .upvotes(post.getUpVotes())
                .downvotes(post.getDownVotes())
                .score(post.getScore())
                .commentCount(post.getCommentCount())
                .viewCount(post.getViewCount())
                .shareCount(post.getShareCount())
                .isNsfw(post.getIsNsfw())
                .isSpoiler(post.getIsSpoiler())
                .isLocked(post.getIsLocked())
                .isArchived(post.getIsArchived())
                .isRepost(post.getIsRepost())
                .originalPostId(post.getOriginalPostId())
                .userVote(userVote)
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .editedAt(post.getEditedAt())
                .build();



    }


}


