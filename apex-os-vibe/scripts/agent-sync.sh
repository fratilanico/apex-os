#!/usr/bin/env bash
set -euo pipefail

agent_name="${1:-}"
if [[ -z "$agent_name" ]]; then
  echo "Usage: scripts/agent-sync.sh <agent-name>"
  exit 1
fi

timestamp=$(date -u "+%Y-%m-%dT%H-%M-%SZ")
report_dir="docs/agent-sync"
report_file="${report_dir}/${timestamp}-${agent_name}.md"

mkdir -p "$report_dir"

{
  echo "# Agent Sync Report"
  echo
  echo "- Agent: ${agent_name}"
  echo "- Timestamp (UTC): ${timestamp}"
  echo "- Branch: $(git rev-parse --abbrev-ref HEAD)"
  echo
  echo "## Git Status"
  echo '```'
  git status -sb
  echo '```'
  echo
  echo "## Diff vs origin/main"
  echo '```'
  git fetch -q origin main || true
  git diff --stat origin/main...HEAD
  echo '```'
  echo
  echo "## Local File Timestamps (top 50 by mtime)"
  echo '```'
  ls -lt | head -n 51
  echo '```'
  echo
  echo "## Recently Changed Files (git)"
  echo '```'
  git log --name-only --pretty=format: | head -n 100
  echo '```'
} > "$report_file"

echo "Wrote ${report_file}"
