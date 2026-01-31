#!/bin/bash

################################################################################
# Auto Snapshot Pruning Script
# Purpose: Automatically prune Time Machine local snapshots and OpenCode
#          snapshots when available disk space falls below threshold
# Author: Auto-generated
# Date: 2026-01-26
################################################################################

# Configuration
THRESHOLD_GB=50
LOG_FILE="${HOME}/.local/share/snapshot-prune/prune.log"
OPENCODE_SNAPSHOT_DIR="${HOME}/.local/share/opencode/snapshot"
OPENCODE_THRESHOLD_GB=150

# Ensure log directory exists
mkdir -p "$(dirname "$LOG_FILE")"

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Get available space in GB
get_available_space_gb() {
    df -g / | tail -1 | awk '{print int($4)}'
}

# Prune Time Machine local snapshots
prune_tm_snapshots() {
    log "Checking Time Machine local snapshots..."
    
    # Get full snapshot listing
    local snapshot_output=$(tmutil listlocalsnapshots / 2>/dev/null || true)
    
    if [ -z "$snapshot_output" ]; then
        log "No Time Machine snapshots found"
        return 0
    fi
    
    # Extract just the snapshot identifiers (lines with dates or hashes)
    local snapshots=$(echo "$snapshot_output" | grep -E "^com\.apple\." || true)
    
    if [ -z "$snapshots" ]; then
        log "No deletable snapshots found"
        return 0
    fi
    
    local total=$(echo "$snapshots" | wc -l | tr -d ' ')
    log "Found $total Time Machine snapshot(s)"
    
    # Delete all but the most recent one
    if [ "$total" -gt 1 ]; then
        local to_delete=$((total - 1))
        log "Deleting $to_delete oldest snapshot(s)"
        
        echo "$snapshots" | head -n "$to_delete" | while IFS= read -r snapshot; do
            if [ -n "$snapshot" ]; then
                # Extract the date/hash portion after the last hyphen or use full identifier
                local snapshot_id=$(echo "$snapshot" | sed 's/com\.apple\.os\.update-//')
                log "Attempting to delete: $snapshot_id"
                tmutil deletelocalsnapshots "$snapshot_id" 2>&1 | grep -v "is not a valid" | tee -a "$LOG_FILE" || log "  (snapshot may be protected)"
            fi
        done
        
        log "Time Machine pruning complete"
    else
        log "Only 1 snapshot, keeping it"
    fi
}

# Prune OpenCode snapshots
prune_opencode_snapshots() {
    [ ! -d "$OPENCODE_SNAPSHOT_DIR" ] && return 0
    
    log "Checking OpenCode snapshots..."
    
    # Quick check - count snapshot directories
    local snapshot_count=$(find "$OPENCODE_SNAPSHOT_DIR" -maxdepth 1 -type d ! -name 'global' ! -name 'snapshot' 2>/dev/null | wc -l | tr -d ' ')
    
    if [ "$snapshot_count" = "0" ]; then
        log "No OpenCode snapshots found"
        return 0
    fi
    
    log "Found $snapshot_count OpenCode snapshot(s)"
    
    # Quick size check with timeout
    local current_size=$(timeout 10 du -sg "$OPENCODE_SNAPSHOT_DIR" 2>/dev/null | cut -f1 | tr -d ' ')
    
    if [ -n "$current_size" ] && [ "$current_size" != "" ]; then
        log "OpenCode snapshots total: ${current_size}GB"
        
        if [ "$current_size" -gt "$OPENCODE_THRESHOLD_GB" ] && [ "$snapshot_count" -gt 3 ]; then
            log "Pruning OpenCode snapshots (keeping 3 most recent)..."
            
            find "$OPENCODE_SNAPSHOT_DIR" -maxdepth 1 -type d ! -name 'global' ! -name 'snapshot' 2>/dev/null | \
                sort | head -n -3 | while IFS= read -r dir; do
                    if [ -n "$dir" ]; then
                        log "Removing: $(basename "$dir")"
                        rm -rf "$dir"
                    fi
                done
        else
            log "OpenCode snapshots within limits"
        fi
    else
        log "Unable to determine size quickly, skipping"
    fi
}

# Main execution
log "====== Auto Snapshot Pruning Started ======"

AVAILABLE=$(get_available_space_gb)
log "Available space: ${AVAILABLE}GB (threshold: ${THRESHOLD_GB}GB)"

if [ "$AVAILABLE" -lt "$THRESHOLD_GB" ]; then
    log "Below threshold - starting cleanup"
    
    prune_tm_snapshots
    sleep 2
    
    AVAILABLE=$(get_available_space_gb)
    log "After TM cleanup: ${AVAILABLE}GB"
    
    if [ "$AVAILABLE" -lt "$THRESHOLD_GB" ]; then
        prune_opencode_snapshots
        sleep 2
        AVAILABLE=$(get_available_space_gb)
        log "After OpenCode cleanup: ${AVAILABLE}GB"
    fi
    
    if [ "$AVAILABLE" -ge "$THRESHOLD_GB" ]; then
        log "SUCCESS: Space recovered"
        osascript -e "display notification \"${AVAILABLE}GB now available\" with title \"Snapshots Pruned\"" 2>/dev/null &
    else
        log "WARNING: Still low on space"
        [ "$AVAILABLE" -lt 10 ] && osascript -e "display notification \"Only ${AVAILABLE}GB available!\" with title \"Low Disk Space\" sound name \"Basso\"" 2>/dev/null &
    fi
else
    log "Sufficient space available"
fi

log "====== Pruning Complete ======"
exit 0
