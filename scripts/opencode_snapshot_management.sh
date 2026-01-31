#!/bin/bash

# Get current snapshot size
CURRENT_SIZE=$(du -sg /Users/nico/.local/share/opencode/snapshot | cut -f1)

# Change to snapshot directory
cd /Users/nico/.local/share/opencode/snapshot || exit

# Find all snapshots, excluding global
SNAPSHOTS=$(find . -maxdepth 1 -type d -not -name 'global' | grep -v '^\.$' | sort -r)

# Counter
COUNT=0

# Process snapshots
for snapshot in $SNAPSHOTS; do
    # Keep only the first snapshot (most recent)
    if [ $COUNT -gt 0 ]; then
        echo "Removing snapshot: $snapshot"
        rm -rf "$snapshot"
    fi
    COUNT=$((COUNT + 1))
done

# Get final size
FINAL_SIZE=$(du -sg /Users/nico/.local/share/opencode/snapshot | cut -f1)

# Log and notify
echo "Snapshot pruning completed at $(date)"
echo "Initial size: ${CURRENT_SIZE}GB, Final size: ${FINAL_SIZE}GB"

# macOS notification
osascript -e "display notification \"Opencode snapshots pruned. Reduced from ${CURRENT_SIZE}GB to ${FINAL_SIZE}GB\" with title \"Snapshot Management\""