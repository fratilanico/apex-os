#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# SIMPLE AGENT LOGGING SYSTEM - NO PM2, NO RAM USAGE
# Agents write to logs, read each other's logs, no continuous processes
# ═══════════════════════════════════════════════════════════════════════════════

LOG_DIR="/Users/nico/apex-os-vibe/logs"
AGENT_NAME="${1:-unknown-agent}"
ACTION="${2:-log}"
MESSAGE="${3:-}"

# Create log directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Function to write log
write_log() {
    local timestamp=$(date -u +"%Y-%m-%d %H:%M:%S UTC")
    local log_file="$LOG_DIR/agent-$(echo $AGENT_NAME | tr '@' '-').log"
    
    echo "[$timestamp] [$AGENT_NAME] $MESSAGE" >> "$log_file"
    
    # Keep only last 100 lines to prevent file bloat
    tail -n 100 "$log_file" > "$log_file.tmp" && mv "$log_file.tmp" "$log_file"
}

# Function to read all agent logs
read_logs() {
    echo "═══════════════════════════════════════════════════════════════════════════════"
    echo "AGENT LOGS - $(date -u +"%Y-%m-%d %H:%M:%S UTC")"
    echo "═══════════════════════════════════════════════════════════════════════════════"
    
    for log in "$LOG_DIR"/agent-*.log; do
        if [ -f "$log" ]; then
            echo ""
            echo "📄 $(basename $log):"
            tail -5 "$log"
        fi
    done
    
    echo ""
    echo "═══════════════════════════════════════════════════════════════════════════════"
}

# Function to update sync state
update_sync() {
    local status="${4:-ACTIVE}"
    local task="${5:-}"
    local progress="${6:-}"
    
    cat > "/Users/nico/apex-os-vibe/.agent_sync_state.json" << EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "agent": "$AGENT_NAME",
  "status": "$status",
  "current_task": "$task",
  "progress": "$progress",
  "message": "$MESSAGE",
  "log_file": "logs/agent-$(echo $AGENT_NAME | tr '@' '-').log"
}
EOF
}

# Main action handler
case "$ACTION" in
    log)
        write_log
        ;;
    read)
        read_logs
        ;;
    sync)
        update_sync
        write_log
        ;;
    *)
        echo "Usage: $0 <agent-name> <log|read|sync> <message> [status] [task] [progress]"
        echo ""
        echo "Examples:"
        echo "  $0 @my-agent log 'Starting work on terminal'"
        echo "  $0 @my-agent read"
        echo "  $0 @my-agent sync 'Building component' ACTIVE 'Building Terminal' '75%'"
        exit 1
        ;;
esac
