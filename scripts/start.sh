#!/bin/bash
set -e

# ── Graceful shutdown ──────────────────────────────────────
cleanup() {
    echo "=== Shutting down ==="
    kill "$SSR_PID" 2>/dev/null || true
    kill "$QUEUE_PID" 2>/dev/null || true
    exit 0
}
trap cleanup SIGTERM SIGINT

# ── Migrations ─────────────────────────────────────────────
echo "=== Running migrations ==="
php artisan migrate --force

# ── Storage link (needed if MEDIA_DISK=public) ─────────────
php artisan storage:link --force 2>/dev/null || true

# ── Cache config (must run at start, after env vars are set) ──
echo "=== Caching configuration ==="
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# ── Inertia SSR server ────────────────────────────────────
echo "=== Starting Inertia SSR server ==="
node bootstrap/ssr/ssr.js &
SSR_PID=$!

# Wait for SSR to be ready (up to 15 seconds)
echo "Waiting for SSR server on port 13714..."
for i in $(seq 1 15); do
    if (echo > /dev/tcp/127.0.0.1/13714) 2>/dev/null; then
        echo "SSR server ready!"
        break
    fi
    if [ "$i" -eq 15 ]; then
        echo "Warning: SSR server may not be ready yet, proceeding anyway"
    fi
    sleep 1
done

# ── Horizon (manages all queue workers) ───────────────────
echo "=== Starting Horizon ==="
php artisan horizon &
QUEUE_PID=$!

# ── PHP development server ─────────────────────────────────
echo "=== Starting PHP server on port ${PORT:-8080} ==="
php artisan serve --host=0.0.0.0 --port="${PORT:-8080}"
