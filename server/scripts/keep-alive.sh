#!/usr/bin/env bash
#
# PricePulse Keep-Alive Ping (curl)
# Usage:
#   ./keep-alive.sh https://your-service.onrender.com
# Or in crontab (every 10 minutes):
#   */10 * * * * /path/to/PricePulse-main/server/scripts/keep-alive.sh https://your-service.onrender.com >> /tmp/pricepulse-ping.log 2>&1
#

TARGET="${1:-${RENDER_SERVER_URL:-http://localhost:3000}}"
TARGET="${TARGET%/}"
if [[ "$TARGET" != *"/health" ]]; then
  TARGET="${TARGET}/health"
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Pinging $TARGET..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -m 30 "$TARGET")

if [ "$HTTP_CODE" -ge 200 ] && [ "$HTTP_CODE" -lt 300 ]; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ Status: $HTTP_CODE OK"
else
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ⚠️ Failed with status: $HTTP_CODE"
fi
