#!/usr/bin/env bash
# push-bd.sh — Export BD state to Canvas via AgentPing
set -euo pipefail

API_URL="${AGENTPING_URL:-http://localhost:7890}"
AGENT_ID="${AGENTPING_AGENT_ID:-lev-canvas}"
AGENT_NAME="${AGENTPING_AGENT_NAME:-Lev Canvas}"
SESSION_ID="${AGENTPING_SESSION_ID:-canvas-$(date +%s)}"

# Parse BD text output into JSON cards
bd_to_json() {
  bd list 2>/dev/null | while IFS= read -r line; do
    # Skip empty lines
    [[ -z "$line" ]] && continue

    # Determine status from symbol
    status="open"
    [[ "$line" == ◐* ]] && status="in_progress"
    [[ "$line" == ●* ]] && status="closed"

    # Extract fields
    id=$(echo "$line" | sed -E 's/^[○◐●] ([^ ]+).*/\1/')
    priority=$(echo "$line" | sed -E 's/.*\[● (P[0-3])\].*/\1/' | grep -E '^P[0-3]$' || echo "P3")
    type=$(echo "$line" | sed -E 's/.*\[(epic|task|bug)\].*/\1/' | grep -E '^(epic|task|bug)$' || echo "task")
    title="${line#* - }"
    title="${title%% (blocked by:*}"
    title="${title%% (blocks:*}"
    title_escaped=$(printf '%s' "$title" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g')

    # Output JSON object (one per line)
    printf '{"id":"%s","title":"%s","column":"%s","priority":"%s","type":"%s"}' \
      "$id" "$title_escaped" "$status" "$priority" "$type"
    echo ","
  done
}

# Build cards JSON array
CARDS="[$(bd_to_json | sed '$ s/,$//' | tr -d '\n')]"

# Push to AgentPing
curl -s -X POST "${API_URL}/api/v1/pings" \
  -H 'Content-Type: application/json' \
  -d "{
    \"agentId\": \"${AGENT_ID}\",
    \"agentName\": \"${AGENT_NAME}\",
    \"sessionId\": \"${SESSION_ID}\",
    \"payload\": {
      \"type\": \"canvas_interaction\",
      \"action\": \"render\",
      \"componentType\": \"kanban\",
      \"componentName\": \"BD Dashboard\",
      \"instruction\": \"Current BD epics and tasks\",
      \"props\": {
        \"columns\": [\"open\", \"in_progress\", \"blocked\", \"closed\"],
        \"cards\": $CARDS
      }
    }
  }"

echo ""
echo "✓ BD state pushed to Canvas"
