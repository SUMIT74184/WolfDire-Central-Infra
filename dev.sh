#!/usr/bin/env bash

set -euo pipefail

# ═══════════════════════════════════════════════════════════════
#  WolfDire Central Infra — Docker Dev Helper
#  Handles startup, shutdown, rebuilds, and aggressive cleanup
#  to prevent disk space leaks from orphaned volumes/images.
# ═══════════════════════════════════════════════════════════════

# Print usage
usage() {
    echo "Usage: $0 [command] [args]"
    echo ""
    echo "Commands:"
    echo "  up                Start all services in the background"
    echo "  down              Stop all services, remove orphans & anonymous volumes"
    echo "  rebuild <svc>     Rebuild a specific service (no cache), clean up old artifacts"
    echo "  rebuild-all       Rebuild all services (no cache), clean up old artifacts"
    echo "  watch             Start docker compose in watch mode with automatic image pruning"
    echo "  prune             Clean up dangling images, stopped containers, and build cache"
    echo "  nuke              FULL cleanup: removes ALL unused images, volumes, and build cache"
    echo "  status            Show Docker disk usage summary"
    echo "  help              Show this help message"
    echo ""
    echo "Available services:"
    echo "  auth-service, post-service, social-connection-service,"
    echo "  feed-service, analytics-service, notification-service, api-gateway"
}

# Show Docker disk space usage
show_disk_usage() {
    echo ""
    echo "═══ Docker Disk Usage ═══"
    docker system df
    echo ""
}

# Standard prune: dangling images, stopped containers, build cache
prune_system() {
    echo "=== Removing dangling images ==="
    docker image prune -f

    echo "=== Removing stopped containers ==="
    docker container prune -f

    echo "=== Removing build cache ==="
    docker builder prune -f

    echo "=== Removing dangling (anonymous) volumes ==="
    docker volume prune -f

    show_disk_usage
}

# Nuclear option: remove ALL unused Docker artifacts
nuke_system() {
    echo ""
    echo "⚠️  WARNING: This will remove ALL unused images, volumes, networks, and build cache."
    echo "   Active containers and their named volumes will NOT be affected."
    echo ""
    read -p "Are you sure? (y/N): " confirm
    if [[ "$confirm" =~ ^[Yy]$ ]]; then
        echo "=== Nuking all unused Docker artifacts ==="
        docker system prune -a --volumes -f
        show_disk_usage
        echo "✅ Cleanup complete!"
    else
        echo "Cancelled."
    fi
}

# Rebuild a single service with no cache and full cleanup
rebuild_service() {
    local svc="$1"

    # Validate service name
    case "$svc" in
        auth-service|post-service|social-connection-service|feed-service|analytics-service|notification-service|api-gateway)
            ;;
        moderation-service)
            echo "⚠️  Warning: moderation-service is currently on hold/disabled."
            return 0
            ;;
        *)
            echo "Error: Unknown service '$svc'"
            usage
            exit 1
            ;;
    esac

    local no_cache_flag=""
    if [ "${2:-}" = "--no-cache" ]; then
        no_cache_flag="--no-cache"
    fi

    echo ""
    echo "═══════════════════════════════════════════════════"
    echo "  Rebuilding: $svc ${no_cache_flag}"
    echo "═══════════════════════════════════════════════════"

    # Step 1: Stop and remove the old container + its anonymous volumes
    echo "=== Stopping old container ==="
    docker compose rm -f -s -v "$svc" 2>/dev/null || true

    # Step 2: Build image (uses cache by default for speed)
    echo "=== Building image ==="
    docker compose build $no_cache_flag "$svc"

    # Step 3: Start the new container
    echo "=== Starting new container ==="
    docker compose up -d --no-deps --force-recreate "$svc"

    # Step 4: Clean up old/dangling images and limit build cache to 500MB
    echo "=== Cleaning up old artifacts ==="
    docker image prune -f
    docker builder prune --keep-storage 500MB -f

    echo "✅ $svc rebuilt successfully!"
}

# ═══════════════════════════════════════════════════════════════
#  Main command dispatcher
# ═══════════════════════════════════════════════════════════════

if [ $# -lt 1 ]; then
    usage
    exit 1
fi

CMD="$1"
shift

case "$CMD" in
    up)
        echo "=== Starting active containers ==="
        docker compose up -d --remove-orphans
        echo "=== Limiting build cache size ==="
        docker builder prune --keep-storage 500MB -f
        ;;
    down)
        echo "=== Stopping containers (removing orphans + anonymous volumes) ==="
        # -v removes anonymous volumes (NOT named volumes like postgres_data)
        # --remove-orphans removes containers from removed services
        docker compose down -v --remove-orphans

        echo "=== Cleaning up dangling images ==="
        docker image prune -f

        echo "=== Cleaning up build cache ==="
        docker builder prune -f

        show_disk_usage
        ;;
    watch)
        echo "=== Launching Docker Compose Watch with Auto-Pruning ==="
        docker compose watch --prune
        ;;
    rebuild)
        if [ $# -lt 1 ]; then
            echo "Error: Rebuild command requires a service name."
            usage
            exit 1
        fi
        rebuild_service "$1"
        show_disk_usage
        ;;
    rebuild-all)
        echo "═══════════════════════════════════════════════════"
        echo "  Rebuilding ALL Active Services (no cache)"
        echo "═══════════════════════════════════════════════════"
        services=("auth-service" "post-service" "social-connection-service" "feed-service" "analytics-service" "notification-service" "api-gateway")
        for svc in "${services[@]}"; do
            rebuild_service "$svc"
        done
        show_disk_usage
        ;;
    prune)
        prune_system
        ;;
    nuke)
        nuke_system
        ;;
    status)
        show_disk_usage
        docker system df -v 2>/dev/null | head -50
        ;;
    help|--help|-h)
        usage
        ;;
    *)
        echo "Error: Unknown command '$CMD'"
        usage
        exit 1
        ;;
esac
