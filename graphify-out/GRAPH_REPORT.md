# Graph Report - project-root2  (2026-08-03)

## Corpus Check
- 294 files · ~705,070 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1206 nodes · 1515 edges · 99 communities detected
- Extraction: 78% EXTRACTED · 22% INFERRED · 0% AMBIGUOUS · INFERRED: 332 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 84|Community 84]]
- [[_COMMUNITY_Community 85|Community 85]]
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 89|Community 89]]
- [[_COMMUNITY_Community 90|Community 90]]
- [[_COMMUNITY_Community 91|Community 91]]
- [[_COMMUNITY_Community 92|Community 92]]
- [[_COMMUNITY_Community 93|Community 93]]
- [[_COMMUNITY_Community 94|Community 94]]
- [[_COMMUNITY_Community 95|Community 95]]
- [[_COMMUNITY_Community 96|Community 96]]
- [[_COMMUNITY_Community 97|Community 97]]
- [[_COMMUNITY_Community 98|Community 98]]
- [[_COMMUNITY_Community 149|Community 149]]
- [[_COMMUNITY_Community 150|Community 150]]
- [[_COMMUNITY_Community 151|Community 151]]
- [[_COMMUNITY_Community 152|Community 152]]
- [[_COMMUNITY_Community 153|Community 153]]
- [[_COMMUNITY_Community 154|Community 154]]
- [[_COMMUNITY_Community 155|Community 155]]
- [[_COMMUNITY_Community 156|Community 156]]
- [[_COMMUNITY_Community 157|Community 157]]
- [[_COMMUNITY_Community 158|Community 158]]
- [[_COMMUNITY_Community 159|Community 159]]
- [[_COMMUNITY_Community 160|Community 160]]
- [[_COMMUNITY_Community 161|Community 161]]
- [[_COMMUNITY_Community 162|Community 162]]
- [[_COMMUNITY_Community 163|Community 163]]
- [[_COMMUNITY_Community 164|Community 164]]
- [[_COMMUNITY_Community 165|Community 165]]
- [[_COMMUNITY_Community 166|Community 166]]
- [[_COMMUNITY_Community 167|Community 167]]
- [[_COMMUNITY_Community 168|Community 168]]
- [[_COMMUNITY_Community 169|Community 169]]
- [[_COMMUNITY_Community 170|Community 170]]
- [[_COMMUNITY_Community 171|Community 171]]
- [[_COMMUNITY_Community 172|Community 172]]
- [[_COMMUNITY_Community 173|Community 173]]
- [[_COMMUNITY_Community 174|Community 174]]
- [[_COMMUNITY_Community 175|Community 175]]
- [[_COMMUNITY_Community 176|Community 176]]
- [[_COMMUNITY_Community 177|Community 177]]
- [[_COMMUNITY_Community 178|Community 178]]
- [[_COMMUNITY_Community 179|Community 179]]
- [[_COMMUNITY_Community 180|Community 180]]

## God Nodes (most connected - your core abstractions)
1. `PostService` - 26 edges
2. `PostController` - 22 edges
3. `KafkaConfig` - 20 edges
4. `ConnectionService` - 18 edges
5. `AuthService` - 18 edges
6. `PostRepository` - 18 edges
7. `AuthController` - 17 edges
8. `JwtUtil` - 16 edges
9. `ConnectionController` - 14 edges
10. `NotificationService` - 14 edges

## Surprising Connections (you probably didn't know these)
- `SettingsPage()` --calls--> `useAuth()`  [INFERRED]
  wolf-frontend/app/settings/page.jsx → wolf-frontend/lib/auth-context.jsx
- `SignupPage()` --calls--> `useAuth()`  [INFERRED]
  wolf-frontend/app/signup/page.jsx → wolf-frontend/lib/auth-context.jsx
- `AuthCallbackContent()` --calls--> `useAuth()`  [INFERRED]
  wolf-frontend/app/auth/callback/page.jsx → wolf-frontend/lib/auth-context.jsx
- `LoginPage()` --calls--> `useAuth()`  [INFERRED]
  wolf-frontend/app/login/page.jsx → wolf-frontend/lib/auth-context.jsx
- `AdminLayout()` --calls--> `useAuth()`  [INFERRED]
  wolf-frontend/app/admin/layout.jsx → wolf-frontend/lib/auth-context.jsx

## Communities

### Community 0 - "Community 0"
Cohesion: 0.04
Nodes (11): CommentService, ConnectionController, EmailNotificationService, FeedController, MigrationController, NotificationBatchProcessor, Post, PostRepository (+3 more)

### Community 1 - "Community 1"
Cohesion: 0.04
Nodes (10): AuthController, AuthService, CustomOAuth2User, CustomOAuth2UserService, FeignClientInterceptor, JwtAuthenticationFilter, JwtUtil, OAuth2LoginSuccessHandler (+2 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (7): NotificationAggregationRepository, NotificationEventConsumer, NotificationPreferenceRepository, NotificationQueryService, NotificationRepository, NotificationService, WebSocketNotificationService

### Community 3 - "Community 3"
Cohesion: 0.05
Nodes (6): CommunityFollowerRepository, CommunityFollowService, CommunityRepository, CommunityService, FeedEventConsumer, RequestLoggingFilter

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (7): AnalyticsEventConsumer, AnalyticsService, AuthKafkaListener, CommunityAnalyticsRepository, ContentAnalyticsRepository, GlobalExceptionHandler, MediaService

### Community 5 - "Community 5"
Cohesion: 0.06
Nodes (6): ConnectionServiceClient, EmbeddingService, FeedItemRepository, FeedRankingAlgorithm, FeedService, PostServiceClient

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (4): BlockedUserRepository, ConnectionRepository, ConnectionService, KafkaProducerService

### Community 7 - "Community 7"
Cohesion: 0.1
Nodes (5): AIService, ContentModerationService, ModerationResultRepository, ModerationService, ReputationService

### Community 8 - "Community 8"
Cohesion: 0.09
Nodes (2): CommunityController, PostController

### Community 9 - "Community 9"
Cohesion: 0.11
Nodes (3): CommentController, VoteRepository, VoteService

### Community 10 - "Community 10"
Cohesion: 0.08
Nodes (13): isTokenExpired(), parseJwt(), useAuth(), DashboardSidebar(), AdminLayout(), Navbar(), AuthCallbackContent(), LoginPage() (+5 more)

### Community 11 - "Community 11"
Cohesion: 0.08
Nodes (4): AnalyticsController, AnalyticsQueryService, TrendingTopicRepository, UserAnalyticsRepository

### Community 12 - "Community 12"
Cohesion: 0.1
Nodes (1): KafkaConfig

### Community 13 - "Community 13"
Cohesion: 0.17
Nodes (2): CommunityFollowController, InternalConnectionController

### Community 14 - "Community 14"
Cohesion: 0.14
Nodes (1): CommentRepository

### Community 15 - "Community 15"
Cohesion: 0.18
Nodes (10): AddMemberRequest, BlockedUserResponse, CommunityInfo, ConnectionActionRequest, ConnectionDTO, ConnectionRequest, ConnectionResponse, ConnectionStats (+2 more)

### Community 17 - "Community 17"
Cohesion: 0.22
Nodes (2): SidebarMenuButton(), useSidebar()

### Community 19 - "Community 19"
Cohesion: 0.2
Nodes (1): RedisConfig

### Community 20 - "Community 20"
Cohesion: 0.2
Nodes (9): AuthDto, AuthResponse, ForgotPasswordRequest, LoginRequest, RefreshTokenRequest, Register, ResetPasswordRequest, TokenValidationResponse (+1 more)

### Community 22 - "Community 22"
Cohesion: 0.22
Nodes (1): NotificationController

### Community 23 - "Community 23"
Cohesion: 0.22
Nodes (1): User

### Community 24 - "Community 24"
Cohesion: 0.57
Nodes (6): addToRemoveQueue(), dispatch(), genId(), reducer(), toast(), useToast()

### Community 25 - "Community 25"
Cohesion: 0.29
Nodes (1): SecurityConfig

### Community 28 - "Community 28"
Cohesion: 0.29
Nodes (1): UserInteractionRepository

### Community 31 - "Community 31"
Cohesion: 0.33
Nodes (1): PostSvcWolfApplication

### Community 32 - "Community 32"
Cohesion: 0.33
Nodes (1): MediaRepository

### Community 37 - "Community 37"
Cohesion: 0.5
Nodes (2): CarouselNext(), useCarousel()

### Community 38 - "Community 38"
Cohesion: 0.5
Nodes (3): ApiError, getAuthHeader(), request()

### Community 39 - "Community 39"
Cohesion: 0.4
Nodes (1): KafkaTopics

### Community 40 - "Community 40"
Cohesion: 0.4
Nodes (1): EventLogRepository

### Community 41 - "Community 41"
Cohesion: 0.4
Nodes (1): UserServiceClient

### Community 42 - "Community 42"
Cohesion: 0.4
Nodes (4): FeedDTO, FeedItemDTO, InteractionRequest, Response

### Community 51 - "Community 51"
Cohesion: 0.5
Nodes (3): CommunityDto, CreateRequest, UpdateRequest

### Community 52 - "Community 52"
Cohesion: 0.5
Nodes (1): WebSocketConfig

### Community 53 - "Community 53"
Cohesion: 0.67
Nodes (1): ApiGatewayApplication

### Community 54 - "Community 54"
Cohesion: 0.67
Nodes (1): ApiGatewayApplicationTests

### Community 59 - "Community 59"
Cohesion: 0.67
Nodes (1): useIsMobile()

### Community 65 - "Community 65"
Cohesion: 1.0
Nodes (2): handleClick(), playClickSound()

### Community 69 - "Community 69"
Cohesion: 0.67
Nodes (1): Loading()

### Community 71 - "Community 71"
Cohesion: 0.67
Nodes (1): ModerationSvcApplication

### Community 72 - "Community 72"
Cohesion: 0.67
Nodes (1): ModerationResult

### Community 73 - "Community 73"
Cohesion: 0.67
Nodes (1): UserReputationRepository

### Community 74 - "Community 74"
Cohesion: 0.67
Nodes (1): ModerationSvcApplicationTests

### Community 75 - "Community 75"
Cohesion: 0.67
Nodes (1): AnalyticsSvcApplication

### Community 76 - "Community 76"
Cohesion: 0.67
Nodes (1): CommentEvent

### Community 77 - "Community 77"
Cohesion: 0.67
Nodes (1): VoteEvent

### Community 78 - "Community 78"
Cohesion: 0.67
Nodes (1): PostEvent

### Community 79 - "Community 79"
Cohesion: 0.67
Nodes (1): ModerationEvent

### Community 80 - "Community 80"
Cohesion: 0.67
Nodes (1): AnalyticsSvcApplicationTests

### Community 81 - "Community 81"
Cohesion: 0.67
Nodes (1): SocialConnectionApplication

### Community 82 - "Community 82"
Cohesion: 0.67
Nodes (1): BlockedUser

### Community 83 - "Community 83"
Cohesion: 0.67
Nodes (1): Connection

### Community 84 - "Community 84"
Cohesion: 0.67
Nodes (1): CommunityFollower

### Community 85 - "Community 85"
Cohesion: 0.67
Nodes (1): DuplicateResourceException

### Community 86 - "Community 86"
Cohesion: 0.67
Nodes (1): BlockedUserException

### Community 87 - "Community 87"
Cohesion: 0.67
Nodes (1): ResourceNotFoundException

### Community 88 - "Community 88"
Cohesion: 0.67
Nodes (1): UnauthorizedException

### Community 89 - "Community 89"
Cohesion: 0.67
Nodes (1): SocialConnectionApplicationTests

### Community 90 - "Community 90"
Cohesion: 0.67
Nodes (1): AuthApplication

### Community 91 - "Community 91"
Cohesion: 0.67
Nodes (1): AuthApplicationTests

### Community 92 - "Community 92"
Cohesion: 0.67
Nodes (1): PostCreatedEvent

### Community 93 - "Community 93"
Cohesion: 0.67
Nodes (1): CommentAddedEvent

### Community 94 - "Community 94"
Cohesion: 0.67
Nodes (1): PostsvcWolfApplicationTests

### Community 95 - "Community 95"
Cohesion: 0.67
Nodes (1): NotificationSvcApplication

### Community 96 - "Community 96"
Cohesion: 0.67
Nodes (1): NotificationSvcApplicationTests

### Community 97 - "Community 97"
Cohesion: 0.67
Nodes (1): FeedSvcApplication

### Community 98 - "Community 98"
Cohesion: 0.67
Nodes (1): FeedSvcApplicationTests

### Community 149 - "Community 149"
Cohesion: 1.0
Nodes (1): ModerationResponse

### Community 150 - "Community 150"
Cohesion: 1.0
Nodes (1): ModerationScores

### Community 151 - "Community 151"
Cohesion: 1.0
Nodes (1): ModerationRequest

### Community 152 - "Community 152"
Cohesion: 1.0
Nodes (1): SentimentResult

### Community 153 - "Community 153"
Cohesion: 1.0
Nodes (1): UserReputation

### Community 154 - "Community 154"
Cohesion: 1.0
Nodes (1): AnalyticsResponse

### Community 155 - "Community 155"
Cohesion: 1.0
Nodes (1): EventLog

### Community 156 - "Community 156"
Cohesion: 1.0
Nodes (1): TrendingTopic

### Community 157 - "Community 157"
Cohesion: 1.0
Nodes (1): CommunityAnalytics

### Community 158 - "Community 158"
Cohesion: 1.0
Nodes (1): UserAnalytics

### Community 159 - "Community 159"
Cohesion: 1.0
Nodes (1): ContentAnalytics

### Community 160 - "Community 160"
Cohesion: 1.0
Nodes (1): UserEvent

### Community 161 - "Community 161"
Cohesion: 1.0
Nodes (1): ConnectionRequestEvent

### Community 162 - "Community 162"
Cohesion: 1.0
Nodes (1): Community

### Community 163 - "Community 163"
Cohesion: 1.0
Nodes (1): CreateCommentRequest

### Community 164 - "Community 164"
Cohesion: 1.0
Nodes (1): CreatePostRequest

### Community 165 - "Community 165"
Cohesion: 1.0
Nodes (1): UpdatePostRequest

### Community 166 - "Community 166"
Cohesion: 1.0
Nodes (1): CommentResponse

### Community 167 - "Community 167"
Cohesion: 1.0
Nodes (1): PostResponse

### Community 168 - "Community 168"
Cohesion: 1.0
Nodes (1): Media

### Community 169 - "Community 169"
Cohesion: 1.0
Nodes (1): Comment

### Community 170 - "Community 170"
Cohesion: 1.0
Nodes (1): Vote

### Community 171 - "Community 171"
Cohesion: 1.0
Nodes (1): SavedPost

### Community 172 - "Community 172"
Cohesion: 1.0
Nodes (1): MentionEvent

### Community 173 - "Community 173"
Cohesion: 1.0
Nodes (1): MarkReadRequest

### Community 174 - "Community 174"
Cohesion: 1.0
Nodes (1): UnreadCountResponse

### Community 175 - "Community 175"
Cohesion: 1.0
Nodes (1): NotificationAggregation

### Community 176 - "Community 176"
Cohesion: 1.0
Nodes (1): Notification

### Community 177 - "Community 177"
Cohesion: 1.0
Nodes (1): NotificationPreference

### Community 178 - "Community 178"
Cohesion: 1.0
Nodes (1): PostDTO

### Community 179 - "Community 179"
Cohesion: 1.0
Nodes (1): FeedItem

### Community 180 - "Community 180"
Cohesion: 1.0
Nodes (1): UserInteraction

## Knowledge Gaps
- **58 isolated node(s):** `ModerationResponse`, `ModerationScores`, `ModerationRequest`, `SentimentResult`, `UserReputation` (+53 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 8`** (34 nodes): `CommunityController`, `.archiveCommunity()`, `.createCommunity()`, `.deleteCommunity()`, `.getAllCommunities()`, `.getCommunityById()`, `.getCommunityBySlug()`, `.getUserId()`, `.shareCommunity()`, `.updateCommunity()`, `PostController.java`, `CommunityController.java`, `PostController`, `.createPost()`, `.deletePost()`, `.getCommunityPosts()`, `.getHotPosts()`, `.getOptionalUserId()`, `.getPost()`, `.getPostsByIds()`, `.getRelatedPosts()`, `.getRequiredUserId()`, `.getSavedPosts()`, `.getTrendingPosts()`, `.getUserPosts()`, `.listPosts()`, `.repost()`, `.savePost()`, `.searchPosts()`, `.searchSemantically()`, `.sharePost()`, `.unsavePost()`, `.updatePost()`, `.incrementShareCount()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (21 nodes): `KafkaConfig.java`, `KafkaConfig.java`, `KafkaConfig.java`, `KafkaConfig.java`, `KafkaConfig.java`, `KafkaConfig`, `.blockEventsTopic()`, `.commentAddedTopic()`, `.connectionEventsTopic()`, `.consumerFactory()`, `.feedInteractionTopic()`, `.feedUpdateTopic()`, `.kafkaListenerContainerFactory()`, `.kafkaTemplate()`, `.mediaUploadedTopic()`, `.objectMapper()`, `.postCreatedTopic()`, `.postFlaggedTopic()`, `.producerFactory()`, `.userMentionedTopic()`, `.voteChangedTopic()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (17 nodes): `CommunityFollowController`, `.addMember()`, `.followCommunity()`, `.getCommunityFollowers()`, `.getCommunityMemberCount()`, `.getUserCommunities()`, `.getUserId()`, `.isFollowing()`, `.toggleNotifications()`, `.unfollowCommunity()`, `CommunityFollowController.java`, `InternalConnectionController.java`, `InternalConnectionController`, `.getFollowerIds()`, `.getFollowingIds()`, `.getUserId()`, `.isFollowingCommunity()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (14 nodes): `CommentRepository`, `.countByPost()`, `.decrementDownvotes()`, `.decrementUpvotes()`, `.findActive()`, `.findByUser()`, `.findReplies()`, `.findTopLevel()`, `.findTopLevelSorted()`, `.incrementDownvotes()`, `.incrementReplyCount()`, `.incrementUpvotes()`, `.getCommentSummary()`, `CommentRepository.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (10 nodes): `sidebar.tsx`, `cn()`, `handleKeyDown()`, `SidebarFooter()`, `SidebarHeader()`, `SidebarMenu()`, `SidebarMenuButton()`, `SidebarMenuItem()`, `SidebarSeparator()`, `useSidebar()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (10 nodes): `RedisConfig.java`, `RedisConfig.java`, `RedisConfig.java`, `RedisConfig.java`, `RedisConfig.java`, `RedisConfig.java`, `RedisConfig.java`, `RedisConfig`, `.cacheManager()`, `.redisTemplate()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (9 nodes): `NotificationController.java`, `NotificationController`, `.deleteNotification()`, `.getPreferences()`, `.getUnreadCount()`, `.getUserNotifications()`, `.markAllAsRead()`, `.markAsRead()`, `.updatePreferences()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (9 nodes): `.toUserSummary()`, `User.java`, `User`, `.getAuthorities()`, `.isAccountNonExpired()`, `.isCredentialsNonExpired()`, `.isEnabled()`, `.onCreate()`, `.onUpdate()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (8 nodes): `SecurityConfig.java`, `SecurityConfig.java`, `SecurityConfig.java`, `SecurityConfig`, `.authenticationManager()`, `.authenticationProvider()`, `.corsConfigurationSource()`, `.securityFilterChain()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (7 nodes): `UserInteractionRepository.java`, `UserInteractionRepository`, `.countByPostIdAndType()`, `.existsByUserIdAndPostIdAndInteractionType()`, `.findByUserIdAndCreatedAtAfter()`, `.findByUserIdAndInteractionTypeIn()`, `.findEngagedPostIds()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (6 nodes): `PostSvcWolfApplication.java`, `PostSvcWolfApplication`, `.chatModel()`, `.embeddingModel()`, `.main()`, `.restTemplate()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (6 nodes): `MediaRepository.java`, `MediaRepository`, `.deleteByPostId()`, `.findByPostId()`, `.findByProcessingStatus()`, `.findByUserId()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (5 nodes): `Carousel()`, `CarouselNext()`, `cn()`, `useCarousel()`, `carousel.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 39`** (5 nodes): `KafkaTopics.java`, `KafkaTopics`, `.contentEnrichedTopic()`, `.contentModeratedTopic()`, `.reputationUpdatedTopic()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 40`** (5 nodes): `EventLogRepository`, `.findByEventTypeAndTimestampAfter()`, `.findByUserIdAndTimestampBetween()`, `.findOldEvents()`, `EventLogRepository.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 41`** (5 nodes): `UserServiceClient.java`, `UserServiceClient.java`, `UserServiceClient`, `.getUserById()`, `.getUserEmail()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 52`** (4 nodes): `WebSocketConfig.java`, `WebSocketConfig`, `.configureMessageBroker()`, `.registerStompEndpoints()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 53`** (3 nodes): `ApiGatewayApplication`, `.main()`, `ApiGatewayApplication.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 54`** (3 nodes): `ApiGatewayApplicationTests`, `.contextLoads()`, `ApiGatewayApplicationTests.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 59`** (3 nodes): `use-mobile.tsx`, `use-mobile.ts`, `useIsMobile()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 65`** (3 nodes): `handleClick()`, `playClickSound()`, `button.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 69`** (3 nodes): `loading.jsx`, `loading.jsx`, `Loading()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 71`** (3 nodes): `ModerationSvcApplication.java`, `ModerationSvcApplication`, `.main()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 72`** (3 nodes): `ModerationResult.java`, `ModerationResult`, `.onCreate()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 73`** (3 nodes): `UserReputationRepository.java`, `UserReputationRepository`, `.findByUserId()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 74`** (3 nodes): `ModerationSvcApplicationTests.java`, `ModerationSvcApplicationTests`, `.contextLoads()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 75`** (3 nodes): `AnalyticsSvcApplication`, `.main()`, `AnalyticsSvcApplication.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 76`** (3 nodes): `CommentEvent`, `CommentEvent.java`, `CommentEvent.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 77`** (3 nodes): `VoteEvent.java`, `VoteEvent.java`, `VoteEvent`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 78`** (3 nodes): `PostEvent.java`, `PostEvent.java`, `PostEvent`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 79`** (3 nodes): `ModerationEvent.java`, `ModerationEvent.java`, `ModerationEvent`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 80`** (3 nodes): `AnalyticsSvcApplicationTests`, `.contextLoads()`, `AnalyticsSvcApplicationTests.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 81`** (3 nodes): `SocialConnectionApplication.java`, `SocialConnectionApplication`, `.main()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 82`** (3 nodes): `BlockedUser`, `.onCreate()`, `BlockedUser.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 83`** (3 nodes): `Connection`, `.onCreate()`, `Connection.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 84`** (3 nodes): `CommunityFollower`, `.onCreate()`, `CommunityFollower.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 85`** (3 nodes): `DuplicateResourceException`, `.DuplicateResourceException()`, `DuplicateResourceException.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 86`** (3 nodes): `BlockedUserException`, `.BlockedUserException()`, `BlockedUserException.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 87`** (3 nodes): `ResourceNotFoundException.java`, `ResourceNotFoundException`, `.ResourceNotFoundException()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 88`** (3 nodes): `UnauthorizedException.java`, `UnauthorizedException`, `.UnauthorizedException()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 89`** (3 nodes): `SocialConnectionApplicationTests.java`, `SocialConnectionApplicationTests`, `.contextLoads()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 90`** (3 nodes): `AuthApplication`, `.main()`, `AuthApplication.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 91`** (3 nodes): `AuthApplicationTests`, `.contextLoads()`, `AuthApplicationTests.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 92`** (3 nodes): `PostCreatedEvent.java`, `PostCreatedEvent.java`, `PostCreatedEvent`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 93`** (3 nodes): `CommentAddedEvent`, `CommentAddedEvent.java`, `CommentAddedEvent.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 94`** (3 nodes): `PostsvcWolfApplicationTests.java`, `PostsvcWolfApplicationTests`, `.contextLoads()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 95`** (3 nodes): `NotificationSvcApplication.java`, `NotificationSvcApplication`, `.main()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 96`** (3 nodes): `NotificationSvcApplicationTests.java`, `NotificationSvcApplicationTests`, `.contextLoads()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 97`** (3 nodes): `FeedSvcApplication`, `.main()`, `FeedSvcApplication.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 98`** (3 nodes): `FeedSvcApplicationTests`, `.contextLoads()`, `FeedSvcApplicationTests.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 149`** (2 nodes): `ModerationResponse.java`, `ModerationResponse`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 150`** (2 nodes): `ModerationScores.java`, `ModerationScores`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 151`** (2 nodes): `ModerationRequest.java`, `ModerationRequest`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 152`** (2 nodes): `SentimentResult.java`, `SentimentResult`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 153`** (2 nodes): `UserReputation.java`, `UserReputation`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 154`** (2 nodes): `AnalyticsResponse`, `AnalyticsResponse.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 155`** (2 nodes): `EventLog`, `EventLog.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 156`** (2 nodes): `TrendingTopic.java`, `TrendingTopic`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 157`** (2 nodes): `CommunityAnalytics`, `CommunityAnalytics.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 158`** (2 nodes): `UserAnalytics.java`, `UserAnalytics`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 159`** (2 nodes): `ContentAnalytics`, `ContentAnalytics.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 160`** (2 nodes): `UserEvent.java`, `UserEvent`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 161`** (2 nodes): `ConnectionRequestEvent`, `ConnectionRequestEvent.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 162`** (2 nodes): `Community`, `Community.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 163`** (2 nodes): `CreateCommentRequest`, `CreateCommentRequest.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 164`** (2 nodes): `CreatePostRequest`, `CreatePostRequest.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 165`** (2 nodes): `UpdatePostRequest.java`, `UpdatePostRequest`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 166`** (2 nodes): `CommentResponse`, `CommentResponse.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 167`** (2 nodes): `PostResponse.java`, `PostResponse`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 168`** (2 nodes): `Media.java`, `Media`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 169`** (2 nodes): `Comment`, `Comment.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 170`** (2 nodes): `Vote.java`, `Vote`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 171`** (2 nodes): `SavedPost.java`, `SavedPost`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 172`** (2 nodes): `MentionEvent.java`, `MentionEvent`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 173`** (2 nodes): `MarkReadRequest.java`, `MarkReadRequest`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 174`** (2 nodes): `UnreadCountResponse.java`, `UnreadCountResponse`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 175`** (2 nodes): `NotificationAggregation.java`, `NotificationAggregation`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 176`** (2 nodes): `Notification.java`, `Notification`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 177`** (2 nodes): `NotificationPreference.java`, `NotificationPreference`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 178`** (2 nodes): `PostDTO.java`, `PostDTO`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 179`** (2 nodes): `FeedItem`, `FeedItem.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 180`** (2 nodes): `UserInteraction.java`, `UserInteraction`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `PostController` connect `Community 8` to `Community 0`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `CustomOAuth2User` connect `Community 1` to `Community 3`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `ModerationResponse`, `ModerationScores`, `ModerationRequest` to the rest of the system?**
  _58 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.04 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.04 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._