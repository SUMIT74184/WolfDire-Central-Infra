# AI Moderation Service - Smart Content Moderation & User Reputation

## Overview
Microservice responsible for **AI-powered content moderation**, **spam detection**, **user reputation scoring**, and **automated content enrichment** (summarization, sentiment analysis, hashtag generation).

---

## Core Features

### 1. **AI Content Moderation (OpenAI Moderation API)**

**Categories Detected:**
- **Toxicity** - Rude, disrespectful, unreasonable language
- **Hate Speech** - Content promoting hate based on identity
- **Violence** - Graphic violence, threats
- **Sexual Content** - Sexual or suggestive material
- **Harassment** - Bullying, intimidation
- **Self-Harm** - Content promoting self-injury

**Thresholds:**
```properties
toxicity-threshold=0.8    # Flag for human review
auto-flag-threshold=0.9   # Auto-remove immediately
spam-threshold=0.7        # Spam detection sensitivity
```

---

### 2. **Spam Detection (Rule-Based + ML)**

**Spam Indicators:**
```java
✓ Multiple URLs in single post
✓ "Click here", "Buy now" phrases
✓ ALL CAPS text
✓ Excessive emojis (💰🔥⚡)
✓ User posts >10 times in short period
✓ "Win free money" patterns
```

**Scoring:**
```
3+ indicators = SPAM
→ Auto-flagged for review
→ User trust score reduced
```

---

### 3. **User Reputation System**

**Trust Score Formula:**
```java
baseScore = 1.0
baseScore -= (flaggedRatio × 0.3)       // % of flagged content
baseScore -= (removalRatio × 0.5)       // % of removed content
baseScore += ((upvoteRatio - 0.5) × 0.2) // Community feedback
baseScore -= (reports > 5 ? 0.1 : 0)     // Report penalty

finalScore = clamp(baseScore, 0.0, 1.0)
```

**Trust Score Impact:**
- **1.0 → 0.7**: Normal user
- **0.7 → 0.5**: Slightly risky, extra scrutiny
- **0.5 → 0.3**: High risk, content flagged for review
- **< 0.3**: Shadow banned (posts hidden from public)
- **0.0**: Permanently banned

**Score Changes:**
| Event | Score Change |
|-------|--------------|
| Post approved | +0.001 |
| Post flagged | -0.05 |
| Post removed | -0.10 |
| Upvote received | +0.002 |
| Downvote received | -0.001 |
| Report received | -0.03 |

---

### 4. **Content Enrichment**

When content is approved, AI automatically generates:

**A. Summarization**
```
Input: 2000-word post about microservices
Output: "This post discusses microservices architecture with Spring Boot. 
         The author shares patterns for handling distributed transactions..."
```

**B. Sentiment Analysis**
```java
Sentiment: POSITIVE / NEUTRAL / NEGATIVE
Score: -1.0 to +1.0
```

**C. Hashtag Extraction** (Future)
```
Content: "I love building with Spring Boot and Kafka!"
Hashtags: #springboot #kafka #microservices
```

---

## Database Schema

```sql
CREATE TABLE moderation_results (
    id BIGSERIAL PRIMARY KEY,
    content_id VARCHAR(255) NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    user_id BIGINT NOT NULL,
    toxicity_score DOUBLE PRECISION DEFAULT 0.0,
    spam_score DOUBLE PRECISION DEFAULT 0.0,
    hate_speech_score DOUBLE PRECISION DEFAULT 0.0,
    violence_score DOUBLE PRECISION DEFAULT 0.0,
    sexual_score DOUBLE PRECISION DEFAULT 0.0,
    flagged BOOLEAN DEFAULT FALSE,
    action VARCHAR(50),
    reason VARCHAR(1000),
    created_at TIMESTAMP DEFAULT NOW(),
    reviewed_at TIMESTAMP,
    reviewed_by BIGINT,
    human_reviewed BOOLEAN DEFAULT FALSE,
    
    INDEX idx_content_id (content_id),
    INDEX idx_user_id (user_id),
    INDEX idx_flagged (flagged)
);

CREATE TABLE user_reputations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    trust_score DOUBLE PRECISION DEFAULT 1.0,
    total_posts BIGINT DEFAULT 0,
    flagged_posts BIGINT DEFAULT 0,
    removed_posts BIGINT DEFAULT 0,
    total_comments BIGINT DEFAULT 0,
    flagged_comments BIGINT DEFAULT 0,
    upvotes_received BIGINT DEFAULT 0,
    downvotes_received BIGINT DEFAULT 0,
    reports_received BIGINT DEFAULT 0,
    shadow_banned BOOLEAN DEFAULT FALSE,
    permanently_banned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_violation_at TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_trust_score (trust_score)
);
```

---

## Moderation Flow

### Pre-Posting Check (Synchronous)

```
User submits post
    ↓
POST /api/v1/moderation/check
    ↓
1. Check user reputation
   - Permanently banned? → Reject
   - Shadow banned? → Accept but hide
    ↓
2. OpenAI Moderation API
   - Toxicity: 0.95 → AUTO_REMOVED
   - Toxicity: 0.85 → FLAGGED_FOR_REVIEW
   - Toxicity: 0.2 → APPROVED
    ↓
3. Spam Detection
   - 4 spam indicators → FLAGGED_FOR_REVIEW
    ↓
4. Determine Action
   - AUTO_REMOVED: Reject post, reduce trust score
   - FLAGGED_FOR_REVIEW: Accept but mark for human review
   - APPROVED: Publish post, generate summary/sentiment
    ↓
5. Update User Reputation
   - Flagged → trustScore -= 0.05
   - Approved → trustScore += 0.001
    ↓
6. Kafka Events
   - content.moderated (if flagged/removed)
   - content.enriched (summary, sentiment)
   - user.reputation.updated
    ↓
Return response to Post Service
```

---

## API Endpoints

### 1. Moderate Content
```bash
POST /api/v1/moderation/check
{
  "contentId": "post-123",
  "contentType": "POST",
  "userId": 456,
  "content": "This is my post about microservices!",
  "recentPostCount": 2
}
```

**Response:**
```json
{
  "approved": true,
  "action": "APPROVED",
  "toxicityScore": 0.02,
  "spamScore": 0.1,
  "hateSpeechScore": 0.0,
  "violenceScore": 0.0,
  "sexualScore": 0.0,
  "flagged": false,
  "reason": "Content approved",
  "trustScore": 0.92,
  "summary": "This post discusses microservices architecture...",
  "sentiment": "POSITIVE"
}
```

### 2. Get User Reputation
```bash
GET /api/v1/moderation/reputation/{userId}
```

**Response:**
```json
{
  "userId": 456,
  "trustScore": 0.87,
  "totalPosts": 120,
  "flaggedPosts": 3,
  "removedPosts": 1,
  "upvotesReceived": 1500,
  "downvotesReceived": 80,
  "reportsReceived": 2,
  "shadowBanned": false,
  "permanentlyBanned": false
}
```

### 3. Track User Actions
```bash
POST /api/v1/moderation/reputation/{userId}/upvote
POST /api/v1/moderation/reputation/{userId}/downvote
POST /api/v1/moderation/reputation/{userId}/report
```

### 4. Ban User
```bash
POST /api/v1/moderation/reputation/{userId}/ban?permanent=true
```

---

## Kafka Events

### Produced Topics

**1. content.moderated**
```json
{
  "contentId": "post-123",
  "contentType": "POST",
  "userId": 456,
  "action": "REMOVE",
  "timestamp": "2025-08-19T10:30:00"
}
```
**Consumed by:** Post Service (to remove flagged content)

**2. content.enriched**
```json
{
  "contentId": "post-123",
  "contentType": "POST",
  "summary": "Short summary of the post...",
  "sentiment": "POSITIVE",
  "sentimentScore": 0.72
}
```
**Consumed by:** Post Service, Feed Service (for enhanced search)

**3. user.reputation.updated**
```json
{
  "userId": 456,
  "trustScore": 0.85,
  "shadowBanned": false,
  "permanentlyBanned": false,
  "flaggedPosts": 3,
  "removedPosts": 1
}
```
**Consumed by:** Connection Service, Feed Service (to filter low-reputation users)

---

## AI Models Used

### OpenAI Moderation API
**Model:** `text-moderation-latest`  
**Endpoint:** `https://api.openai.com/v1/moderations`  
**Cost:** Free (no token charge)  
**Latency:** ~200-500ms  

**Categories:**
```json
{
  "hate": 0.0001,
  "hate/threatening": 0.0,
  "harassment": 0.00012,
  "self-harm": 0.0,
  "sexual": 0.00003,
  "sexual/minors": 0.0,
  "violence": 0.00002,
  "violence/graphic": 0.0
}
```

### Fallback (Mock Moderation)
If OpenAI API key not configured:
```java
Simple keyword matching:
- "hate", "kill" → toxicity: 0.7
- "porn", "sex" → sexual: 0.6
- Deterministic for development/testing
```

---

## Shadow Banning Strategy

**What is Shadow Banning?**
- User can post normally (no error message)
- Their posts are **hidden from public feed**
- Only the user sees their own content
- Used for borderline spammers (not malicious enough for full ban)

**Triggers:**
- Trust score < 0.3
- 10+ reports received
- Multiple flagged posts in short period

**Implementation:**
```java
if (reputation.isShadowBanned()) {
    post.setVisibility(Visibility.AUTHOR_ONLY);
    feedService.excludeFromPublicFeed(post.getId());
}
```

---

## Performance Considerations

### Latency Budget
```
Total moderation time: < 500ms

OpenAI API: ~300ms
Spam detection: ~10ms
Database lookup: ~20ms
Reputation update: ~50ms
Kafka publish: ~20ms
```

### Caching
```
User reputation cached in Redis (1 hour TTL)
→ Avoid DB lookup on every post
```

### Rate Limiting
```
OpenAI API: 3000 requests/min (free tier)
→ For high-volume periods, queue moderation checks
→ Allow posts through, flag asynchronously
```

---

## A/B Testing Framework (Future)

**Experiment: Strict vs Lenient Moderation**

```java
if (userId % 2 == 0) {
    threshold = 0.7;  // Strict group
} else {
    threshold = 0.9;  // Lenient group
}
```

**Metrics to Track:**
- False positive rate (good content flagged)
- False negative rate (toxic content approved)
- User engagement post-moderation
- Appeal rate

---

## Human Review Workflow

**Flagged Content Queue:**
```sql
SELECT * FROM moderation_results 
WHERE flagged = TRUE 
  AND human_reviewed = FALSE
ORDER BY created_at DESC
LIMIT 50;
```

**Admin Dashboard (Future):**
- Review flagged posts
- Override AI decision
- Update moderation thresholds
- Ban/unban users

---

## Monitoring & Alerts

### Key Metrics
```
moderation_latency_ms         - Time to moderate content
moderation_flagged_rate       - % of content flagged
moderation_auto_removed_rate  - % of content auto-removed
user_trust_score_avg          - Average trust score across all users
shadow_ban_rate               - % of users shadow banned
```

### Alerts
```
🚨 Moderation API error rate > 5%
🚨 Average trust score < 0.6 (too strict)
🚨 Flagged rate > 20% (threshold too low)
🚨 Auto-removal rate > 5% (might be over-moderating)
```

---

## Environment Variables

```bash
OPENAI_API_KEY=sk-proj-...
POSTGRES_URL=jdbc:postgresql://localhost:5432/moderation_db
REDIS_HOST=localhost
KAFKA_BOOTSTRAP_SERVERS=localhost:9092
EUREKA_URL=http://localhost:8761/eureka/

AI_MODERATION_TOXICITY_THRESHOLD=0.8
AI_MODERATION_AUTO_FLAG_THRESHOLD=0.9
AI_REPUTATION_INITIAL_SCORE=1.0
```

---

## Running the Service

```bash
docker-compose up -d
```

Service: `http://localhost:8085`

---

## Next Steps

1. **Image/Video Moderation** - Integrate OpenAI Vision API
2. **Multi-Language Support** - Translate before moderation
3. **Appeal System** - Users can contest decisions
4. **Real-time Dashboard** - Monitor flagged content queue
5. **Custom ML Model** - Train Reddit-specific toxicity detector
6. **Contextual Moderation** - Same word OK in r/gaming, not in r/news