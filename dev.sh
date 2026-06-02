#!/usr/bin/env bash

set -euo pipefail

# Print usage
usage() {
    echo "Usage: $0 [command] [args]"
    echo ""
    echo "Commands:"
    echo "  up                Start all services in the background"
    echo "  down              Stop all services and clean up network"
    echo "  rebuild <svc>     Rebuild a specific service, recreate its container, and prune old images"
    echo "  rebuild-all       Rebuild all services, recreate containers, and prune old images"
    echo "  watch             Start docker compose in watch mode with automatic image pruning"
    echo "  prune             Clean up dangling images and stopped containers to free space"
    echo "  help              Show this help message"
    echo ""
    echo "Available services:"
    echo "  auth-service, post-service, social-connection-service,"
    echo "  feed-service, analytics-service, notification-service, api-gateway"
}

prune_system() {
    echo "=== Cleaning up dangling/old images ==="
    docker image prune -f
    echo "=== Cleaning up stopped containers ==="
    docker container prune -f
}

rebuild_service() {
    local svc="$1"
    
    # Check if service is valid (ignoring moderation-service since it's held)
    case "$svc" in
        auth-service|post-service|social-connection-service|feed-service|analytics-service|notification-service|api-gateway)
            ;;
        moderation-service)
            echo "Warning: moderation-service is currently on hold/disabled."
            return 0
            ;;
        *)
            echo "Error: Unknown service '$svc'"
            usage
            exit 1
            ;;
    esac

    echo "=== Rebuilding Docker Image for $svc ==="
    docker compose build "$svc"
    
    echo "=== Recreating Container for $svc ==="
    docker compose up -d --no-deps --force-recreate "$svc"
    
    prune_system
}

# Main command dispatcher
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
        ;;
    down)
        echo "=== Stopping containers ==="
        docker compose down --remove-orphans
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
        ;;
    rebuild-all)
        echo "=== Rebuilding ALL Active Services ==="
        services=("auth-service" "post-service" "social-connection-service" "feed-service" "analytics-service" "notification-service" "api-gateway")
        for svc in "${services[@]}"; do
            rebuild_service "$svc"
        done
        ;;
    prune)
        prune_system
        echo "=== To reclaim extra space, run: docker system prune -a --volumes ==="
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
