# WolfDire — Production Deployment Plan (single VPS)

This plan deploys the whole stack — 7 Spring Boot services, the API gateway, Eureka,
Postgres, MongoDB, Redis, Redpanda (Kafka) and the Next.js frontend — on **one VPS**
with Docker Compose and **Caddy** for automatic HTTPS.

---

## 1. What size VPS do you need?

### Memory budget (from `docker-compose.yml` limits)

| Component | RAM limit |
|---|---|
| Postgres (pgvector) | 256 MB |
| MongoDB | 256 MB |
| Redis | 64 MB |
| Redpanda (Kafka) | 300 MB |
| Eureka | 256 MB |
| 6 services + API gateway (7 × 256 MB, JVM `-Xmx128m`) | 1,792 MB |
| **Backend subtotal** | **~2.9 GB** |
| Next.js frontend (`next start`) | ~300 MB |
| Caddy (reverse proxy + HTTPS) | ~50 MB |
| Ubuntu + Docker daemon | ~600 MB |
| **Steady-state total** | **~3.9 GB** |

On top of that:
- **Building images on the server**: each Maven build takes ~1–1.5 GB RAM while it runs.
- **Startup**: 8 JVMs booting at once are CPU-heavy; on 2 vCPUs startup takes several minutes and health checks may time out.
- **Headroom**: the `-Xmx128m` heaps are tight for Spring Boot + Kafka + JPA. If a service gets
  killed (exit code 137) or logs `OutOfMemoryError`, you'll want to raise it to `-Xmx192m` / `mem_limit: 384m`.

### Recommendation

| Tier | Specs | Verdict |
|---|---|---|
| Minimum (not recommended) | 2 vCPU · 4 GB RAM · 40 GB SSD + 4 GB swap | Runs only with current tight limits; build images elsewhere; slow startup; OOM risk |
| **Recommended** | **4 vCPU · 8 GB RAM · 80 GB NVMe SSD** | Comfortable: room for builds, Postgres cache and bigger JVM heaps |
| Growth | 8 vCPU · 16 GB RAM · 160 GB SSD | Real traffic, AI features on, larger heaps, room for monitoring |

Example providers for the **4 vCPU / 8 GB** tier (prices change — check current pricing):
- Budget: Hetzner (CPX31 / CX32), Contabo, Hostinger KVM — roughly **$8–20/month**
- Mainstream: DigitalOcean, Vultr, Linode/Akamai — roughly **$40–50/month**

Pick **Ubuntu 24.04 LTS** and a region close to your users.

> Uploaded images are stored on **UploadThing**, not on the VPS, so disk is only needed for
> Docker images (~3 GB), databases, Kafka logs and backups.

---

## 2. Target architecture

```
                 Internet
                    │  80 / 443 only
              ┌─────▼─────┐
              │   Caddy   │  automatic Let's Encrypt HTTPS
              └──┬─────┬──┘
   wolfdire.com  │     │  api.wolfdire.com
          ┌──────▼──┐ ┌▼────────────┐
          │frontend │ │ api-gateway │──► Eureka (service discovery)
          │ :3000   │ │   :8090     │
          └─────────┘ └──────┬──────┘
         ┌───────┬──────┬────┴───┬─────────┬───────────┐
       auth    post   social   feed    analytics  notification
         └───────┴──────┴────┬───┴─────────┴───────────┘
            Postgres · MongoDB · Redis · Redpanda (internal network only)
```

Only Caddy is reachable from the internet. Databases, Kafka, Eureka and the individual
services are reachable **only inside the Docker network**.

---

## 3. Required code changes before deploying

These are hard-coded for local development and **will break or be insecure in production**.

| # | File | Problem | Change to |
|---|---|---|---|
| 1 | `services/Auth/src/main/java/org/example/auth/config/OAuth2LoginSuccessHandler.java:81` | After Google/GitHub login, redirects to `http://localhost:3000/auth/callback` | Read from a property, e.g. `app.frontend-url` → `https://wolfdire.com/auth/callback` |
| 2 | `services/Auth/src/main/resources/application.yml:42` | OAuth `redirect-uri: http://localhost:8081/login/oauth2/...` | `https://api.wolfdire.com/login/oauth2/code/{registrationId}` (via env var) |
| 3 | `services/Auth/src/main/java/org/example/auth/config/SecurityConfig.java:97` | CORS allows only `localhost:3000/3001` | Read allowed origins from a property; add `https://wolfdire.com` |
| 4 | `api-gateway/src/main/resources/application.yml:17` | Gateway CORS allows only `http://localhost:3000` | Add `https://wolfdire.com` (env-driven) |
| 5 | `docker-compose.yml` (7 places) | `JWT_SECRET` is hard-coded **and committed to git** | `JWT_SECRET: ${JWT_SECRET}`, and generate a **new** secret (the old one is in git history) |
| 6 | `docker-compose.yml` | Postgres user/password `postgres` / `postgres` | `${POSTGRES_PASSWORD}` everywhere |
| 7 | `docker-compose.yml` | All DB/infra/service ports published on `0.0.0.0` (**Docker bypasses `ufw`!**) | Removed by the prod override below |

The prod override in step 4.2 handles #5–#7 without editing the base file.
#1–#4 need small code changes. **Ask Claude to make #1–#4 configurable if you want them done for you.**

---

## 4. Files to add to the repo

### 4.1 `.env` on the server (never commit it — already in `.gitignore`)

```bash
# ── Domain ─────────────────────────────────────────────
DOMAIN=wolfdire.com

# ── Secrets (generate fresh values!) ───────────────────
# openssl rand -base64 48
JWT_SECRET=CHANGE_ME
# openssl rand -base64 24 | tr -d '/+='
POSTGRES_PASSWORD=CHANGE_ME

# ── Email (Gmail app password or SMTP provider) ────────
MAIL_USERNAME=
MAIL_PASSWORD=

# ── OAuth providers ────────────────────────────────────
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GITHUB_CLIENT_ID=
SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GITHUB_CLIENT_SECRET=
SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_FACEBOOK_CLIENT_ID=
SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_FACEBOOK_CLIENT_SECRET=

# ── AI ─────────────────────────────────────────────────
GEMINI_API_KEY=

# ── Frontend (UploadThing) ─────────────────────────────
UPLOADTHING_TOKEN=
```

### 4.2 `docker-compose.prod.yml` (override — layered on top of `docker-compose.yml`)

Requires Docker Compose **v2.24+** (for `!reset` / `!override`).

```yaml
# Usage: docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

x-app-env: &app-env
  SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD}
  JWT_SECRET: ${JWT_SECRET}

services:
  # ── Infrastructure: no public ports, auto-restart ────────────────────────
  postgres:
    ports: !reset []
    restart: unless-stopped
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
  mongodb:
    ports: !reset []
    restart: unless-stopped
  redis:
    ports: !reset []
    restart: unless-stopped
  kafka:
    ports: !reset []
    restart: unless-stopped
  eureka-server:
    ports: !reset []
    restart: unless-stopped

  # ── Services: internal only, shared secrets from .env ────────────────────
  auth-service:
    ports: !reset []
    restart: unless-stopped
    environment: *app-env
  post-service:
    ports: !reset []
    restart: unless-stopped
    environment: *app-env
  social-connection-service:
    ports: !reset []
    restart: unless-stopped
    environment: *app-env
  feed-service:
    ports: !reset []
    restart: unless-stopped
    environment: *app-env
  analytics-service:
    ports: !reset []
    restart: unless-stopped
    environment: *app-env
  notification-service:
    ports: !reset []
    restart: unless-stopped
    environment: *app-env
  api-gateway:
    ports: !reset []
    restart: unless-stopped

  # ── Frontend ─────────────────────────────────────────────────────────────
  frontend:
    build:
      context: ./wolf-frontend
      args:
        NEXT_PUBLIC_API_URL: https://api.${DOMAIN}
    container_name: wolf-frontend
    restart: unless-stopped
    mem_limit: 512m
    environment:
      UPLOADTHING_TOKEN: ${UPLOADTHING_TOKEN}
    depends_on:
      - api-gateway
    networks:
      - project-network

  # ── Reverse proxy with automatic HTTPS ───────────────────────────────────
  caddy:
    image: caddy:2-alpine
    container_name: caddy
    restart: unless-stopped
    mem_limit: 128m
    ports:
      - "80:80"
      - "443:443"
      - "443:443/udp"
    environment:
      DOMAIN: ${DOMAIN}
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      - frontend
      - api-gateway
    networks:
      - project-network

volumes:
  caddy_data:
  caddy_config:
```

> `POSTGRES_PASSWORD` only takes effect when the Postgres volume is **first created**.
> On a fresh VPS that's automatic. If you reuse an old volume, change the password with
> `ALTER USER postgres PASSWORD '...'` inside the container.

### 4.3 `Caddyfile`

```caddy
{$DOMAIN}, www.{$DOMAIN} {
	encode zstd gzip
	reverse_proxy frontend:3000
}

api.{$DOMAIN} {
	encode zstd gzip
	reverse_proxy api-gateway:8090
}
```

Caddy gets and renews Let's Encrypt certificates automatically and proxies WebSockets
(notifications) without extra config.

### 4.4 `wolf-frontend/Dockerfile`

```dockerfile
# ── Build ────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# NEXT_PUBLIC_* values are baked into the JS bundle at build time
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build && npm prune --omit=dev

# ── Run ──────────────────────────────────────────────────
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app ./
EXPOSE 3000
CMD ["npm", "start"]
```

### 4.5 `wolf-frontend/.dockerignore`

```
node_modules
.next
.env*
frontend.log
```

(Keeps your local `.env.local` secrets out of the image.)

---

## 5. Step-by-step deployment

### Step 1 — DNS (do this first; certificates need it)
At your domain registrar, create A records pointing to the VPS IP:

| Type | Name | Value |
|---|---|---|
| A | `@` | `<VPS_IP>` |
| A | `www` | `<VPS_IP>` |
| A | `api` | `<VPS_IP>` |

### Step 2 — Secure the server
```bash
ssh root@<VPS_IP>

# Create a deploy user and use SSH keys
adduser deploy && usermod -aG sudo deploy
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy

# Disable root + password login
sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin no/; s/^#\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart ssh

# Firewall: only SSH + web
ufw allow OpenSSH && ufw allow 80 && ufw allow 443 && ufw --force enable

# Updates + brute-force protection
apt update && apt upgrade -y && apt install -y fail2ban unattended-upgrades git
```

### Step 3 — Swap (protects against build-time OOM)
```bash
fallocate -l 4G /swapfile && chmod 600 /swapfile
mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

### Step 4 — Install Docker
```bash
curl -fsSL https://get.docker.com | sh
usermod -aG docker deploy
# log out and back in as deploy
docker compose version   # must be v2.24 or newer
```

### Step 5 — Get the code and configure
```bash
sudo mkdir -p /opt/wolfdire && sudo chown deploy:deploy /opt/wolfdire
git clone <your-repo-url> /opt/wolfdire
cd /opt/wolfdire
nano .env                 # paste the template from 4.1 and fill it in
chmod 600 .env
```
Make sure `docker-compose.prod.yml`, `Caddyfile`, `wolf-frontend/Dockerfile` and
`wolf-frontend/.dockerignore` are committed (or copied onto the server).

### Step 6 — Build images (one at a time to avoid running out of RAM)
```bash
alias dc='docker compose -f docker-compose.yml -f docker-compose.prod.yml'
echo "alias dc='docker compose -f docker-compose.yml -f docker-compose.prod.yml'" >> ~/.bashrc

for svc in auth-service post-service social-connection-service feed-service \
           analytics-service notification-service api-gateway frontend; do
  dc build "$svc"
done
```
Builds take a while the first time (Maven downloads dependencies).

### Step 7 — Start
```bash
dc up -d
dc ps                     # everything should become "healthy" / "running"
docker stats --no-stream  # check memory use
```

### Step 8 — Verify
- `https://wolfdire.com` loads with a valid padlock
- `https://api.wolfdire.com/api/auth/health` → `{"status":"UP",...}`
- Sign up, log in, create a community, write a post with an image, open the feed
- `dc logs -f auth-service` (or any service) shows no errors

### Step 9 — Update OAuth provider consoles
Add the production callback URLs (keep the localhost ones for development):

| Provider | Authorized redirect URI |
|---|---|
| Google Cloud Console | `https://api.wolfdire.com/login/oauth2/code/google` |
| GitHub OAuth App | `https://api.wolfdire.com/login/oauth2/code/github` |
| Facebook Login | `https://api.wolfdire.com/login/oauth2/code/facebook` |

Also add `https://wolfdire.com` as an allowed origin in the **UploadThing** dashboard if required.

---

## 6. Day-to-day operations

| Task | Command |
|---|---|
| Status | `dc ps` |
| Logs | `dc logs -f --tail=200 <service>` |
| Restart one service | `dc restart <service>` |
| Deploy new code | `git pull && dc build <service> && dc up -d <service>` |
| Deploy everything | `git pull && <build loop from step 6> && dc up -d` |
| Clean old images | `docker image prune -f` |
| Memory / CPU | `docker stats` |

### Backups (daily, keep 7 days)
Create `/opt/wolfdire/backup.sh`:
```bash
#!/usr/bin/env bash
set -euo pipefail
DIR=/opt/backups/$(date +%F)
mkdir -p "$DIR"
docker exec shared-postgres pg_dumpall -U postgres | gzip > "$DIR/postgres.sql.gz"
docker exec shared-mongodb mongodump --archive --gzip > "$DIR/mongo.archive.gz"
find /opt/backups -maxdepth 1 -type d -mtime +7 -exec rm -rf {} +
```
```bash
chmod +x /opt/wolfdire/backup.sh
(crontab -l 2>/dev/null; echo "0 3 * * * /opt/wolfdire/backup.sh") | crontab -
```
**Copy backups off the server** too (e.g. `rclone` to Backblaze B2 / S3 / Google Drive) —
a backup on the same disk doesn't survive losing the VPS.

**Restore Postgres:** `gunzip -c postgres.sql.gz | docker exec -i shared-postgres psql -U postgres`

### Monitoring (free options)
- **Uptime:** UptimeRobot or Better Stack pinging `https://api.wolfdire.com/api/auth/health` and the homepage
- **Resources:** `docker stats`, or install Netdata / Dozzle (log viewer) bound to localhost and accessed via SSH tunnel

---

## 7. Security checklist

- [ ] New `JWT_SECRET` generated (the one in git history is compromised)
- [ ] Strong `POSTGRES_PASSWORD`
- [ ] No database/Kafka/Eureka/service ports public — check with `sudo ss -tlnp` (only 22, 80, 443)
- [ ] SSH key-only login, root login disabled, fail2ban running
- [ ] `.env` is `chmod 600` and not in git
- [ ] CORS + OAuth redirect URLs point to the real domain (section 3)
- [ ] Off-server backups working (test a restore once!)
- [ ] Consider moving OAuth tokens out of the callback URL (noted in `OAuth2LoginSuccessHandler`)

---

## 8. When you outgrow one VPS

1. **Raise JVM heaps first** (`-Xmx` in each service's `Dockerfile`, plus `mem_limit`) and upgrade the VPS plan.
2. **Move data out:** managed Postgres + Redis (DigitalOcean / Neon / Upstash) so the VPS only runs stateless services.
3. **Build in CI:** GitHub Actions builds images and pushes them to GHCR; the server only runs `dc pull && dc up -d` — faster deploys, no build RAM spikes.
4. **Scale out:** a second VPS behind a load balancer, or move to Kubernetes (k3s) once you need multiple replicas.
