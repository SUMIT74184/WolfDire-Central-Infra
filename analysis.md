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
| **Social** | `connection-events`, `block-events`, `feed.fanout` | `post.created`, `reputation-updated` |
| **Moderation** | `content-moderated`, `content-enriched`, `reputation-updated` | *(none)* |
| **Analytics** | *(none)* | `post.created`, `comment.added`, `vote.changed`, `user.registered`, `content-moderated`, `post.viewed` |
| **Notification** | *(none — sends email only)* | `comment.added`, `vote.changed`, `content-moderated`, `content-enriched`, `user.mentioned`, `post.trending` |

### Topic Mismatch Resolution

- [x] NotificationSvc `comment.created` → fixed to `comment.added`
- [x] NotificationSvc `vote.cast` → fixed to `vote.changed` + VoteService now publishes
- [x] NotificationSvc `moderation.flagged`/`moderation.approved` → fixed to `content-moderated`/`content-enriched`
- [x] NotificationSvc `user.mentioned` → PostSvc + CommentSvc now publish this event
- [x] SocialConnection `user.reputation.updated` → fixed to `reputation-updated`
- [x] AnalyticsSvc all 6 topics → remapped to actual producer topics
- [ ] NotificationSvc `post.trending` → **still no producer** (future: analytics-driven trending detection)

---

## 3. Frontend → Backend Gap Analysis

### ✅ Wired Pages (11 / 23 total pages)

| Frontend Page | API Call | Service |
|--------------|---------|--------|
| `/login` | `authApi.login()` | Auth |
| `/signup` | `authApi.register()` | Auth |
| `/feed` | `feedApi.getFeed()` | Feed |
| `/post/[id]` | `postApi.getById(id)` | Post |
| `/dashboard` | `analyticsApi.dashboard()` | Analytics |
| `/write` | `postApi.create()` | Post |
| `/profile` | `authApi.me()` + `socialApi.followers()` + `postApi.list()` | Auth + Social + Post |
| `/explore` | `postApi.list()` with pagination | Post |
| `/admin/analytics` | `analyticsApi.dashboard()` | Analytics |
| `/admin/users` | `authAdminApi.listUsers()` + `banUser()` | Auth |
| `/admin/moderation` | `moderationApi.getFlaggedQueue()` + approve/reject | Moderation |

### ❌ Remaining — No Backend Support (12 pages)

| Frontend Page | Issue | Priority |
|--------------|-------|-----------|
| `/forgot-password` | No `POST /api/auth/forgot-password` endpoint | High |
| `/verify-email` | No `POST /api/auth/verify-email` endpoint | High |
| `/communities` | No community endpoints in Post/Social Svc | Medium |
| `/community/[id]` | No community detail endpoints | Medium |
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
| Password reset | `POST /api/auth/forgot-password` | High (Phase 3) |
| Email verification | `POST /api/auth/verify-email?token=` | High (Phase 3) |
| Communities | `GET/POST /api/posts/communities` | Medium (Phase 5) |
| Threaded comments | `GET /api/posts/:id/comments` with pagination | ✅ Done (Phase 5) |

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
