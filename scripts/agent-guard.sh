#!/usr/bin/env bash
set -euo pipefail

echo "== Agent Guard =="

echo "1) Git status"
git status -sb

echo "2) Uncommitted changes"
git diff --stat

echo "3) Incoming changes from origin/main"
git fetch -q origin main || true
git log --oneline --decorate --graph --max-count=5 origin/main..HEAD

echo "4) Conflicts check"
if git diff --name-only --diff-filter=U | grep -q .; then
  echo "Conflicts detected. Resolve before proceeding."
  exit 1
fi

echo "5) Summary"
echo "Branch: $(git rev-parse --abbrev-ref HEAD)"
echo "Ahead/Behind:"
git status -sb | head -n 1

echo "Guard OK"
