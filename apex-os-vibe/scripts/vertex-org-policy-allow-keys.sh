#!/usr/bin/env bash
# Lift org policies that block service account key creation for a specific project.
# WARNING: Requires org-admin privileges. Use with caution.

set -euo pipefail

if [[ -z "${ORG_ID:-}" ]]; then
  echo "[error] ORG_ID is required (export ORG_ID=your_org_id)" >&2
  exit 1
fi

PROJECT_ID="${PROJECT_ID:-project-ac3ab367-cee9-4de2-921}"

allow_policy() {
  local constraint="$1"
  cat > /tmp/${constraint//\//_}.yaml <<EOF
name: organizations/${ORG_ID}/policies/${constraint}
spec:
  rules:
  - condition:
      expression: "resource.matchProject('projects/${PROJECT_ID}')"
    enforce: FALSE
  - enforce: TRUE
EOF
  echo "[info] Setting policy to allow for project ${PROJECT_ID}: ${constraint}" >&2
  gcloud org-policies set-policy /tmp/${constraint//\//_}.yaml
}

# Common constraints that block key creation
allow_policy "iam.disableServiceAccountKeyCreation"
allow_policy "iam.managed.disableServiceAccountApiKeyCreation"

echo "[done] Policies updated for project ${PROJECT_ID}. You can now create service account keys in this project." >&2
