# WolfDire – Architecture & Gap Analysis

## 1. Microservices Topology

```
                         ┌─────────────────────────────────────────┐
                         │         wolf-frontend (Next.js)         │
                         │         http://localhost:3000            │
                         └────────────────┬────────────────────────┘
                                          │ NEXT_PUBLIC_API_URL=:8090
                                          ▼
                         ┌─────────────────────────────────────────┐
                         │        API Gateway (Spring Cloud)       │
                         │         http://localhost:8090            │
                         │  - Global CORS (allow :3000)            │
                         │  - JWT pass-through                     │
                         │  - Eureka lb:// routing                 │
                         └──────────┬────────────────┬────────────┘
                                    │ route by path  │
         ┌──────────────────────────┼────────────────┼──────────────────────────┐
         │                          │                │                          │
         ▼                          ▼                ▼                          ▼
  ┌─────────────┐          ┌──────────────┐  ┌─────────────┐          ┌──────────────────┐
  │ Auth Svc    │          │ Post Svc     │  │ Feed Svc    │          │ Social Conn Svc  │
  │  :8081      │          │  :8082       │  │  :8084      │          │  :8083           │
  │ /api/auth/** │          │ /api/posts/**│  │ /api/feed/**│          │ /api/social/**   │
  └──────┬──────┘          └──────┬───────┘  └──────┬──────┘          └────────┬─────────┘
         │                        │                  │                          │
         ▼                        ▼                  ▼                          ▼
  ┌──────────────────────────────────────────────────────────────────────────────────────┐
  │                          Shared Infrastructure                                       │
  │  ┌────────────────┐  ┌───────────────────┐  ┌────────────────┐                       │
  │  │ PostgreSQL :5432│  │   Kafka :29092    │  │  Redis :6379   │                       │
  │  │  auth_db        │  │  (6 topics)       │  │  (cache +      │                       │
  │  │  post_db        │  │                   │  │   sessions)    │                       │
  │  │  feed_db        │  └───────────────────┘  └────────────────┘                       │
  │  │  social_conn_db │                                                                  │
  │  │  analytics_db   │  ┌───────────────────┐  ┌────────────────┐                       │
  │  │  notification_db│  │  MongoDB  :27017   │  │  Eureka :8761  │                      │
  │  └────────────────┘  │  (post media)     │  │  (discovery)   │                        |   │                        └───────────────────┘  └────────────────┘                      │
  └──────────────────────────────────────────────────────────────────────────────────────┘

  ┌──────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
  │ Analytics Svc│    │ Notification Svc :8087│    │ Moderation Svc :8085│
  │  :8086       │    │  /api/notifications/** │    │  /api/moderation/** │
  │  /api/analytics│  │  (Kafka consumer)   │    │  (STANDBY/AI)       │
  └──────────────┘    └─────────────────────┘    └─────────────────────┘

  Tools: Kafka UI :8080
```

---

## 2. Kafka Event Flow (Current State After Fixes)

| Service | Produces Topics | Consumes Topics |
|---------|----------------|-----------------|
| **Auth** | `user.registered`, `user.login`, `user.logout`, `user.login.oauth2` | `tenant.created`, `auth.password-reset-requested` |
| **Post** | `post.created`, `comment.added`, `vote.changed`, `user.mentioned`, `post.viewed` | `post.created` *(AIService)* |
| **Feed** | *(none)* | `post.created`, `feed.update` |
| **Social** | `connection-events`, `block-events`, `feed.fanout` | `post.create| Frontend Page | Issue | Priority |
|--------------|-------|-----------|
| `/forgot-password` | ✅ Wired with React Query | High |
| `/verify-email` | ✅ Wired with React Query | High |
| `/communities` | ✅ Wired — completed | Medium |
| `/community/[id]` | ✅ Wired — completed | Medium |
| `/admin` | Needs role guard only | Medium |
| `/admin/articles` | ❌ No backend endpoints for overall post/article management | Medium |
| `/admin/users` | ✅ Wired (list, ban, unban) | Medium |
| `/admin/analytics` | ✅ Wired to AnalyticsSvc | Medium |
| `/admin/moderation` | ✅ Wired to ModerationSvc | Medium |
| `/admin/settings` | ❌ No backend endpoints for system-wide configuration | Low |
| `/about` | Static — no backend needed | — |
| `/contact` | No contact form endpoint | Low |
| `/pricing` | Static — no backend needed | — |
| `/become-author` | No author role logic | Low |
| `/` (home) | Static — no backend needed | — |

### 🛠️ Admin Mapping Gaps
- **`/admin/articles`**: Currently, `PostSvc` only allows users to see their own posts or community posts. Admin needs a "God View" endpoint: `GET /api/posts/admin/list` (all posts regardless of user).
- **`/admin/settings`**: Needs a `SettingsSvc` or a table in `AuthSvc` for global flags (e.g., `registrationEnabled`, `maintenanceMode`).

---

## 4. Backend → Frontend Gap Analysis

These backend capabilities exist but have **no frontend consumer**:

| Endpoint | Service | Status |
|----------|---------|--------|
| `POST /api/auth/logout` | Auth | ✅ Sidebar logout wired |
| `POST /api/auth/refresh` | Auth | ✅ AuthContext auto-refresh |
| `GET /api/auth/validate` | Auth | ✅ AuthContext JWT route guards |
| OAuth2 Google/GitHub redirect | Auth | ✅ Social auth buttons wired |
| `GET /api/analytics/user/:id` | Analytics | ✅ Surfaced in profile analytics tab |
| `GET /api/analytics/content/:id` | Analytics | ❌ No per-content analytics UI |
| `GET /api/analytics/trending` | Analytics | ❌ Not surfaced on Explore page |
| `POST /api/social/follow/:id` | Social | ✅ Wired on Profile and Community pages |
| Notification polling/WebSocket | Notification | ✅ Notification bell UI wired with polling |

### 🔍 Feed & Post Mapping Details
The following "Feed Card" items found in typical Reddit/WolfDire designs are mapped as follows:

| UI Element | Backend Field | Status |
|------------|---------------|--------|
| **Heading** | `Post.title` | ✅ Mapped |
| **Writer** | `Post.username` | ✅ Mapped |
| **Comments Count** | `Post.commentCount` | ✅ Mapped |
| **Date** | `Post.createdAt` | ✅ Mapped |
| **Small Images** | `Post.thumbnailUrl` | ✅ Mapped |
| **Upvote/Downvote**| `Post.score`, `Post.upVotes` | ✅ Mapped |
| **Save Button** | **Missing** | ❌ No "SavedPost" table in DB |
| **Share Button** | `Post.shareCount` | ⚠️ Counter exists, social share is client-side |

---

## 5. Missing Backend Endpoints

| Feature | Missing Endpoint | Priority |
|---------|-----------------|----------|
| Password reset | `POST /api/auth/reset-password` | ✅ Done (Phase 8) |
| Email verification| `POST /api/auth/verify-email?token=` | ✅ Done (Phase 8) |
| Communities | `GET/POST /api/communities` | ✅ Done (Phase 5) |
| Threaded comments | `GET /api/posts/:id/comments` | ✅ Done (Phase 9) |
| **Save Content** | `POST /api/social/save/:postId` | **Medium** |
rity |
|--------------|-------|-----------|
| `/forgot-password` | ✅ Wired with React Query | High |
| `/verify-email` | ✅ Wired with React Query | High |
| `/communities` | ✅ Backend implemented, needs UI wiring | Medium |-- completed
| `/community/[id]` | ✅ Backend implemented, needs UI wiring | Medium |-- completed
| `/admin` | Needs role guard only | Medium |
| `/admin/articles` | No admin article management endpoints | Medium |
| `/about` | Static — no backend needed | — |
| `/contact` | No contact form endpoint | Low |
| `/pricing` | Static — no backend needed | — |
| `/become-author` | No author role logic | Low |
| `/admin/settings` | No settings/config endpoints | Low |
| `/` (home) | Static — no backend needed | — |

---

## 4. Backend → Frontend Gap Analysis

These backend capabilities exist but have **no frontend consumer**:

| Endpoint | Service | Status |
|----------|---------|--------|
| `POST /api/auth/logout` | Auth | ✅ Sidebar logout wired |
| `POST /api/auth/refresh` | Auth | ✅ AuthContext auto-refresh |
| `GET /api/auth/validate` | Auth | ✅ AuthContext JWT route guards |
| OAuth2 Google/GitHub redirect | Auth | ✅ Social auth buttons wired |
| `GET /api/analytics/user/:id` | Analytics | ✅ Surfaced in profile analytics tab |
| `GET /api/analytics/content/:id` | Analytics | ❌ No per-content analytics UI |
| `GET /api/analytics/trending` | Analytics | ❌ Not surfaced on Explore page |
| `POST /api/social/follow/:id` | Social | ❌ No follow button on profile |
| Notification polling/WebSocket | Notification | ✅ Notification bell UI wired with polling |

---

## 5. Missing Backend Endpoints

| Feature | Missing Endpoint | Priority |
|---------|-----------------|----------|
| Password reset | `POST /api/auth/forgot-password` | ✅ Done (Phase 3) |
| Email verification | `POST /api/auth/verify-email?token=` | ✅ Done (Phase 3) |
| Communities | `GET/POST /api/communities` | ✅ Done (Phase 5) |
| Threaded comments | `GET /api/posts/:id/comments` with pagination | ✅ Done (Phase 9) |

---

## 6. Port Map

| Service | Port | Notes |
|---------|------|-------|
| Next.js Frontend | 3000 | `pnpm dev` |
| API Gateway | **8090** | All frontend requests route here |
| Auth Service | 8081 | — |
| Post Service | 8082 | — |
| Social Connection | 8083 | — |
| Feed Service | 8084 | — |
| Moderation Service | 8085 | STANDBY |
| Analytics Service | 8086 | — |
| Notification Service | 8087 | — |
| Kafka UI | 8080 | Admin tool |
| Eureka | 8761 | Service registry |
| PostgreSQL | 5432 | Shared |
| MongoDB | 27017 | Post media |
| Redis | 6379 | Cache + Sessions |
| Kafka | 29092 (internal) / 9092 (host) | — |
| Zookeeper | 2181 | — |

---

## 7. Phase 6: Frontend State & Data Fetching (React Query)

**Objective**: Replace `useEffect`/`useState` pattern with `@tanstack/react-query` to ensure automated caching, robust background fetching, and simplified global state synchronization for dynamic data. Remove leftover static stubs.

### Migration Status (Complete)
- [x] **Setup**: Configure `QueryClientProvider` globally in `app/layout.jsx`
- [x] **Profile (`/profile`)**: Refactor user info, social stats, post lists, and personal analytics to parallel `useQuery` hooks.
- [x] **Feed (`/feed`)**: Migrate to use `useQuery` / `useInfiniteQuery`.
- [x] **Post Detail (`/post/[id]`)**: Migrate post data + comments, and use `useMutation` for likes/comments.
- [x] **Explore (`/explore`)**: Migrate post list fetching.
- [x] **Analytics Dashboard (`/dashboard`)**: Migrate to `useQuery`.
- [x] **Notifications**: Implement polling via React Query `refetchInterval` instead of custom interval logic.
- [x] **Admin Panels (`/admin/*`)**: Refactor lists and moderation mutations leveraging query invalidations.

> **Conclusion (Phases 4, 5, & 6)**: The frontend has successfully been fully dynamically wired. Caching and state synchronization are managed entirely by React Query (`useQuery`, `useMutation`), eliminating all local state fetching effects (`useEffect`). Hardcoded components and static data arrays have been replaced with real backend connections. Microservices via the API gateway are actively consumed and properly propagating via Kafka.


```
1. Data Integrity & ValidationIn your "Proposed Changes" for PostsvcWolf, you mentioned trusting the frontend ID for speed. While acceptable for a MVP, this is a common source of "Orphaned Posts" (posts pointing to a community that doesn't exist).Refinement: Implement a Cache-Aside or Synchronous Validation pattern.The Logic: When PostsvcWolf receives a communityId, it should check its local cache. If missing, it performs a quick Feign call to SocialConnection to verify the ID exists.Why? If a community is deleted in SocialConnection, PostsvcWolf needs to know what to do with the existing posts (cascade delete or archive).

2. Managing the memberCount DenormalizationYou included memberCount (Long) in your Community entity. This is great for performance (so you don't have to COUNT(*) the follow table every time), but it introduces a state synchronization requirement.The Logic: You must update the CommunityService or use a JPA Entity Listener / Database Trigger.The Flow: 1. User hits POST /api/communities/follow.2. CommunityFollowController records the follow.

3. Crucial Step: The Community entity's memberCount must be incremented in the same transaction (or via an async event).3. Improved API Gateway RoutingYou suggested routing /api/communities/** to SocialConnection.Recommendation: Stick to the /api/communities/** path rather than nesting it under /api/social/communities.Reasoning: It makes the API cleaner for the frontend and treats "Community" as a top-level resource. Just ensure your Gateway configuration explicitly maps the specific path to the SocialConnection load balancer.

5. Potential Technical Debt: Naming InconsistencyThe fact that PostsvcWolf uses subredditId while your new entity uses communityId is a "Leaky Abstraction" from whatever inspired the code.Suggestion: If you have the time, use a @Alias or simply rename the field in PostsvcWolf to communityId. Having two different names for the exact same ID across services will inevitably confuse new developers joining the project later.
```

---

## 8. Required Environment Variables

To fully run the application without errors, ensure the following environment variables are provided:

### Backend Services
**AuthSvc**
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

**PostSvcWolf**
- `AWS_ACCESS_KEY` (for cloud storage, optional if local)
- `AWS_SECRET_KEY`
- `OPENAI_API_KEY` (for AI content features)

**NotificationSvc**
- `MAIL_USERNAME` (SMTP email address)
- `MAIL_PASSWORD` (SMTP app password)

### Frontend (`wolf-frontend/.env.local`)
- `NEXT_PUBLIC_API_URL=http://localhost:8090` (API Gateway URL)

---

## 9. Profile Feature — Gap Analysis

### ✅ Fixed: `/me` Endpoint Returns Incomplete Data

The `GET /api/auth/me` endpoint now returns full data:
```json
{ "email", "userId", "tenantId", "authorities" }
```
**Missing fields** that the frontend profile page expects:
- `firstName`, `lastName` — exist on User entity but not returned
- `profilePictureUrl` — exists on User entity but not returned
- `createdAt` — exists on User entity but not returned
- `bio`, `location`, `website` — **do NOT exist** on User entity at all
- `karma`, `postCount` — **no backend concept** for these

### ✅ Fixed: Follow/Followers/Following API Path Mismatch

| What | Frontend calls | Backend actual path |
|------|---------------|---------------------|
| Follow | `POST /api/social/follow/{userId}` | `POST /api/v1/connections/follow/{targetUserId}` |
| Unfollow | `DELETE /api/social/unfollow/{userId}` | `DELETE /api/v1/connections/follow/{targetUserId}` |
| Followers | `GET /api/social/followers/{userId}` | `GET /api/v1/connections/followers` (no userId param, reads from JWT) |
| Following | `GET /api/social/following/{userId}` | `GET /api/v1/connections/following` (no userId param, reads from JWT) |

The **API Gateway** routes `/api/social/**` to the SocialConnection service, and `ConnectionController` now correctly uses `/api/social/**`. The frontend API client also no longer passes a `{userId}` to followers/following to match the backend behavior.

### 🟡 Missing Backend Endpoints for Profile

| Feature | Missing Endpoint | Service | Priority |
|---------|-----------------|---------|----------|
| Update Profile | `PUT /api/auth/me` (update bio, location, website, name, avatar) | Auth | ✅ **Completed** |
| Change Password | `POST /api/auth/change-password` | Auth | **High** |
| User's Posts | `GET /api/posts/user/{userId}` | PostsvcWolf | ✅ **Completed** |
| Save/Bookmark Post | `POST /api/posts/{postId}/save`<br>`DELETE /api/posts/{postId}/save` | PostsvcWolf | ✅ **Completed** |
| Get Saved Posts | `GET /api/posts/saved` | PostsvcWolf | ✅ **Completed** |

### 🟡 Missing User Entity Fields

The `User` entity in Auth service currently has:
`id, email, password, firstName, lastName, tenantId, provider, oauth2Id, profilePictureUrl, roles, enabled, accountNonLocked, createdAt, updatedAt`

**Needs to be added:**
- ✅ `bio` (String, nullable) — user biography
- ✅ `location` (String, nullable) — city/country
- ✅ `website` (String, nullable) — personal URL
- ✅ `postCount` (Integer) — tracked dynamically via Kafka `post.created` / `post.deleted`

### 🟢 Frontend Tab Wiring Status

| Tab | Current Status | Required Backend |
|-----|---------------|------------------|
| **Posts** | ✅ Wired to `postApi.getUserPosts(userId)` | `GET /api/posts/user/{userId}` (Completed) |
| **Saved** | ✅ Wired to `postApi.getSavedPosts()` | `GET /api/posts/saved` (Completed) |
| **Communities** | ✅ Wired to `communityApi.myCommunities()` | `GET /api/communities/my-communities` (Mapped) |
| **Analytics** | ✅ Wired to `analyticsApi.user()` | — |

### ✅ Frontend UI Elements Not Wired (Fixed)

| Element | Status |
|---------|--------|
| **Edit Profile** button | ✅ Opens dialog to edit fields, wired to `PUT /api/auth/me` |
| **Settings** button | ❌ No settings page yet |
| **Avatar** | ✅ Fetches from query |
| **Bio** | ✅ Fetches from query |
| **Location / Website / Email** | ✅ Fetches from query |
| **Karma** | ❌ Shows `0` (waiting on feature definition) |
| **Posts count** | ✅ Accurately reflects Kafka-tracked user `postCount` |

---

## 10. Settings Feature — Gap Analysis

### Feature Matrix (Backend Readiness)

| Settings Feature | Backend Status | Service | Frontend Status |
|-----------------|---------------|---------|----------------|
| **Account Deactivation** | 🔴 Missing | Auth | 🔴 No page |
| **Notification Preferences** | ✅ Fully built | NotificationSvc | 🔴 Not wired |
| **Profile Visibility** | 🔴 Missing | Auth | 🔴 No page |
| **Blocked Users** | 🟡 Partial | SocialConnection | 🔴 Not wired |
| **MFA / 2FA** | 🔴 Missing | Auth | 🔴 No page (v2) |

---

### 1. Account Deactivation 🔴

**Backend:** No self-deactivation endpoint exists. The `User` entity has `enabled` and `accountNonLocked` fields, but these are only toggled by admin endpoints (`POST /api/auth/users/{id}/ban`). There is no user-initiated deactivation or deletion flow.

**What's Needed (Backend):**
| Endpoint | Description | Priority |
|----------|-------------|----------|
| `POST /api/auth/deactivate` | Self-deactivate (set `enabled=false`, blacklist tokens, publish Kafka event) | **High** |
| `POST /api/auth/reactivate` | Re-enable account via email verification link | Medium |
| `DELETE /api/auth/account` | Permanent deletion (GDPR-compliant, cascade to all services via Kafka) | Low (v2) |

**What's Needed (Frontend):**
- Settings page → "Deactivate Account" section with confirmation modal
- Reactivation flow on login attempt (if `enabled=false`, show "Account deactivated" message with re-enable option)

---

### 2. Notification Preferences ✅ Backend / 🔴 Frontend

**Backend (FULLY BUILT):** The `NotificationPreference` entity has 13 configurable fields:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `emailEnabled` | Boolean | `true` | Email notifications master toggle |
| `pushEnabled` | Boolean | `true` | Push notifications master toggle |
| `websocketEnabled` | Boolean | `true` | Real-time WebSocket toggle |
| `commentNotifications` | Boolean | `true` | Notify on comment on your post |
| `replyNotifications` | Boolean | `true` | Notify on reply to your comment |
| `upvoteNotifications` | Boolean | `true` | Notify on upvotes |
| `mentionNotifications` | Boolean | `true` | Notify on @mentions |
| `moderationNotifications` | Boolean | `true` | Notify on moderation actions |
| `followerNotifications` | Boolean | `true` | Notify on new followers |
| `digestEnabled` | Boolean | `true` | Email digest toggle |
| `digestFrequency` | Enum | `DAILY` | `DAILY`, `WEEKLY`, etc. |

**Backend Endpoints (exist, not wired):**
- `GET /api/notifications/preferences/{userId}` — fetch current preferences
- `PUT /api/notifications/preferences/{userId}` — update preferences

**What's Needed (Frontend only):**
- Add `notificationApi.getPreferences(userId)` and `notificationApi.updatePreferences(userId, prefs)` to `api-client.ts`
- Settings page → "Notification Preferences" section with toggles for each field
- Wire via React Query `useQuery` + `useMutation`

---

### 3. Profile Visibility (Public/Private Toggle) 🔴

**Backend:** No concept of profile visibility exists. The `User` entity has no `isPublic`/`isPrivate` field. There is no middleware or filter that checks profile visibility before returning user data.

**What's Needed (Backend):**
| Item | Description | Service |
|------|-------------|---------|
| `profileVisibility` field on `User` entity | Enum: `PUBLIC`, `PRIVATE`, `FOLLOWERS_ONLY` | Auth |
| `PUT /api/auth/me` (include visibility in update) | Update profile visibility | Auth |
| Visibility check in `GET /api/auth/users/{id}` | Return limited data if viewer is not follower and profile is private | Auth |
| Inter-service check | Other services (Post, Social) should respect visibility via header or Feign call | All |

**What's Needed (Frontend):**
- Settings page → "Privacy" section with radio/toggle for Public/Private/Followers Only
- Other users' profiles should show limited info when private

---

### 4. Blocked Users 🟡 Partially Built

**Backend (Partial):** `BlockedUser` entity, block/unblock endpoints, and block-checking logic all EXIST:
- `POST /api/v1/connections/block/{blockedUserId}` — block a user ✅
- `DELETE /api/v1/connections/block/{blockedUserId}` — unblock a user ✅
- `BlockedUserRepository` has `existsByBlockerIdAndBlockedId` and `findByBlockerIdAndBlockedId` ✅
- Kafka `block-events` topic published on block ✅

**What's Missing (Backend):**
| Item | Description | Priority |
|------|-------------|----------|
| `GET /api/v1/connections/blocked` | List all users blocked by current user (paginated) | **High** |
| `findByBlockerId(Long, Pageable)` | Repository method to fetch blocked users list | **High** |
| ⚠️ Path mismatch | Controller is at `/api/v1/connections/block/**` but gateway routes `/api/social/**` — calls will **404** | **Critical** |

**What's Needed (Frontend):**
- Add `socialApi.block(userId)`, `socialApi.unblock(userId)`, `socialApi.blockedUsers()` to `api-client.ts`
- Settings page → "Blocked Users" section with list + unblock buttons
- Block button on user profiles

---

### 5. MFA / Two-Factor Authentication 🔴 (Version 2)

**Backend:** No MFA infrastructure exists. No TOTP libraries, no recovery codes, no MFA-related fields on User entity.

**What Will Be Needed (v2):**
| Item | Description | Service |
|------|-------------|---------|
| `mfaEnabled` field on `User` entity | Boolean flag | Auth |
| `mfaSecret` field on `User` entity | Encrypted TOTP secret | Auth |
| `POST /api/auth/mfa/enable` | Generate TOTP secret, return QR code URI | Auth |
| `POST /api/auth/mfa/verify` | Verify TOTP code and enable MFA | Auth |
| `POST /api/auth/mfa/disable` | Disable MFA with password confirmation | Auth |
| MFA challenge on login | After password validation, require TOTP code if MFA enabled | Auth |
| Recovery codes | Generate & store one-time backup codes | Auth |
| Library dependency | `com.warrenstrange:googleauth` or similar TOTP library | Auth |

**What Will Be Needed (Frontend — v2):**
- Settings → "Security" section with MFA enable/disable toggle
- QR code display modal on enable
- TOTP input dialog during login flow
- Recovery codes display & download

---

### 📋 Settings Implementation Priority Summary

| Priority | Feature | Backend Work | Frontend Work |
|----------|---------|-------------|---------------|
| 🟢 **P0** (wire only) | Notification Preferences | None — endpoints exist | Build settings UI + wire |
| 🟡 **P1** | Blocked Users List | Add list endpoint + fix path | Build blocked users UI |
| 🟡 **P1** | Account Deactivation | New endpoint + token blacklist | Build deactivation UI |
| 🟡 **P1** | Profile Visibility | New entity field + update endpoint | Build privacy toggle |
| 🔵 **P2** (v2) | MFA / 2FA | Full new subsystem | Full new UI flow |