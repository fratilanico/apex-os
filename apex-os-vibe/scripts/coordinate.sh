#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# AGENT COORDINATION - SIMPLE FILE-BASED (NO PM2)
# Usage: ./scripts/coordinate.sh @agent-name "What I'm doing" "progress%"
# ═══════════════════════════════════════════════════════════════════════════════

AGENT="${1:-@unknown}"
TASK="${2:-}"
PROGRESS="${3:-}"

# Log the activity
/Users/nico/apex-os-vibe/scripts/agent-log.sh "$AGENT" sync "$TASK" "ACTIVE" "$TASK" "$PROGRESS"

# Show current coordination status
echo ""
echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║                    AGENT COORDINATION STATUS                                  ║"
echo "╚═══════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Read sync state
if [ -f "/Users/nico/apex-os-vibe/.agent_sync_state.json" ]; then
    echo "📊 Current Sync State:"
    cat /Users/nico/apex-os-vibe/.agent_sync_state.json | grep -E '"agent"|"status"|"current_task"|"progress"' | sed 's/^[[:space:]]*/  /'
fi

echo ""
echo "📋 Recent Activity:"
/Users/nico/apex-os-vibe/scripts/agent-log.sh "$AGENT" read

echo ""
echo "✅ Coordination complete. Other agents can read logs to see status."
echo ""
