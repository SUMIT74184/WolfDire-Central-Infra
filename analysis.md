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

## 2. Kafka Event Flow (As Implemented in Code)

| Service | Produces Topics | Consumes Topics |
|---------|----------------|-----------------|
| **Auth** | - | `tenant.created`, `auth.password-reset-requested` |
| **Post** | `post.created`, `comment.added`, `vote.changed`, `post.flagged`, `media.uploaded`, `user.mentioned` | - |
| **Feed** | `feed.update`, `feed.interaction` | `post.created` |
| **Social** | `connection-events`, `block-events`, `feed.fanout` | - |
| **Moderation**| `content-moderated`, `content-enriched`, `reputation-updated` | - |
| **Analytics** | - | `post-events`, `comment-events`, `vote-events`, `user-events`, `moderation-events`, `view-events` |
| **Notification**| TBD | TBD |

*(Note: There is an architectural mismatch between what AnalyticsSvc consumes (`post-events`) and what PostSvc produces (`post.created`). This needs to be harmonized in Phase 4).*

---

## 3. Frontend → Backend Gap Analysis

These frontend pages exist but have **no API wiring** yet:

| Frontend Page | Needs From Backend | Service | Status |
|--------------|-------------------|---------|--------|
| `/login` | `POST /api/auth/login` | Auth | ✅ Wired to API client |
| `/signup` | `POST /api/auth/register` | Auth | ✅ Wired to API client |
| `/forgot-password` | No backend endpoint exists | Auth | ❌ Missing endpoint in Auth |
| `/verify-email` | No backend endpoint exists | Auth | ❌ Missing endpoint in Auth |
| `/feed` | `GET /api/feed` | Feed | ✅ Wired to API client |
| `/post/[id]` | `GET /api/posts/:id` | Post | ✅ Wired to API client |
| `/write` | `POST /api/posts` | Post | ⚠️ API client exists, page not wired |
| `/profile` | `GET /api/auth/me`, `GET /api/social/followers/:id` | Auth + Social | ⚠️ API client exists, page not wired |
| `/explore` | `GET /api/posts?sort=trending` | Post | ⚠️ API client exists, page not wired |
| `/communities` | Community endpoints | Post | ❌ No community endpoints in Post Svc |
| `/community/[id]` | Community details | Post | ❌ No community endpoints in Post Svc |
| `/dashboard` | `GET /api/analytics/dashboard` | Analytics | ✅ Wired to API client |
| `/admin/analytics` | `GET /api/analytics/*` | Analytics | ⚠️ Endpoint exists, no page wiring |
| `/admin/users` | `GET /api/auth/users` | Auth | ⚠️ Endpoint exists, no page wiring |
| `/admin/moderation` | `GET /api/moderation/*` | Moderation | ⚠️ Endpoint exists (STANDBY) |

---

## 4. Backend → Frontend Gap Analysis

These backend capabilities exist but have **no frontend consumer**:

| Endpoint | Service | Missing Frontend |
|----------|---------|-----------------|
| `POST /api/auth/logout` | Auth | No logout button calls this |
| `POST /api/auth/refresh` | Auth | No token refresh logic in frontend |
| `GET /api/auth/validate` | Auth | No validation on route guards |
| `GET /api/analytics/user/:id` | Analytics | No per-user analytics UI |
| `GET /api/analytics/content/:id` | Analytics | No per-content analytics UI |
| `GET /api/analytics/trending` | Analytics | Not surfaced on Explore page |
| `POST /api/social/follow/:id` | Social | No follow button on profile pages |
| Notification polling/WebSocket | Notification | No notification bell UI wiring |
| OAuth2 Google/GitHub redirect | Auth | No "Login with Google/GitHub" buttons |

---

## 5. Missing Backend Endpoints

| Feature | Missing Endpoint | Priority |
|---------|-----------------|----------|
| Password reset | `POST /api/auth/forgot-password` | High (Phase 3) |
| Email verification | `POST /api/auth/verify-email?token=` | High (Phase 3) |
| Communities | `GET/POST /api/posts/communities` | Medium (Phase 5) |
| Threaded comments | `GET /api/posts/:id/comments` with pagination | High (Phase 5) |

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
