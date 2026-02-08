#!/bin/bash

# Snapshot directory
SNAPSHOT_DIR="/Users/nico/.local/share/opencode/snapshot"

# Get current snapshot size
CURRENT_SIZE=$(du -sg "$SNAPSHOT_DIR" | cut -f1)

# Log the current size
echo "Current snapshot size: ${CURRENT_SIZE}GB"

# Pruning function
prune_snapshots() {
    # Find snapshot directories (excluding 'global')
    # -mindepth 1 ensures we don't include the SNAPSHOT_DIR itself
    # sort ensures we keep the most recent one (alphabetically/chronologically if named by date/hash)
    local SNAPSHOTS_TO_DELETE=$(sudo find "$SNAPSHOT_DIR" -mindepth 1 -maxdepth 1 -type d -not -name 'global' | sort | head -n -1)

    if [ -n "$SNAPSHOTS_TO_DELETE" ]; then
        echo "Deleting old snapshots:"
        echo "$SNAPSHOTS_TO_DELETE"
        echo "$SNAPSHOTS_TO_DELETE" | xargs sudo rm -rf
    else
        echo "No old snapshots to prune (keeping the latest one)."
    fi

    # Get final size after pruning
    local FINAL_SIZE=$(du -sg "$SNAPSHOT_DIR" | cut -f1)

    # Notify
    osascript -e "display notification \"Opencode snapshots pruned. Reduced from ${CURRENT_SIZE}GB to ${FINAL_SIZE}GB\" with title \"Snapshot Management\""
}

# If size is over 150GB, prune
if [ "$CURRENT_SIZE" -gt 150 ]; then
    prune_snapshots
fi