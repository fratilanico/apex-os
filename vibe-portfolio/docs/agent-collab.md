# Agent Collaboration Protocol

This protocol ensures delta-safe collaboration across multiple AI agents.

## Core Rules

1. Each agent works on its own branch:
   - `claude/YYYY-MM-DD/<topic>`
   - `opencode/YYYY-MM-DD/<topic>`
   - `kimi/YYYY-MM-DD/<topic>`
2. No direct pushes to `main`.
3. Every push is preceded by a sync report.
4. All merges are via PRs.

## Conflict Guard

If a file is touched by multiple agents:
- The PR must show exact diffs.
- A reviewer agent validates the local + GitHub state.
- Conflicts are resolved explicitly in the PR.

## Required Agents

Create these roles per change cycle:
- **Builder**: implements features.
- **Reviewer**: compares local vs origin and runs checks.
- **Integrator**: prepares PR and ensures all deltas are preserved.

## Standard Flow

1. Builder runs `scripts/agent-sync.sh <agent>`.
2. Builder runs `scripts/agent-guard.sh`.
3. Builder commits and pushes to their branch.
4. Reviewer runs `scripts/agent-guard.sh` and reviews PR.
5. Integrator merges via PR.

## GitHub CLI Usage

Create PR:
```
gh pr create --title "feat: <summary>" --body "## Summary\n- ..." --base main --head <branch>
```

Review PR:
```
gh pr view <pr-number> --files
```

## Sync Reports

Sync reports are stored in `docs/agent-sync/` with timestamped filenames.
They should be committed with the PR.
