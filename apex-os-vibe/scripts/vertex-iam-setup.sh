#!/usr/bin/env bash
# Vertex IAM setup helper
# Purpose: create a Vertex-capable service account, grant required roles, optionally remove an org policy, and emit a base64 ADC for Vercel.
# Usage:
#   export PROJECT_ID="project-ac3ab367-cee9-4de2-921"
#   export ORG_ID=""                  # optional, if you have org-level rights
#   export CONSTRAINT_NAME=""         # optional, e.g., constraints/compute.disableSerialPortLogging
#   ./scripts/vertex-iam-setup.sh

set -euo pipefail

PROJECT_ID="${PROJECT_ID:-project-ac3ab367-cee9-4de2-921}"
ORG_ID="${ORG_ID:-}"
CONSTRAINT_NAME="${CONSTRAINT_NAME:-}"

SA_ID="vertex-policy-editor"
SA_NAME="Vertex Policy Editor"
SA_EMAIL="${SA_ID}@${PROJECT_ID}.iam.gserviceaccount.com"

echo "[info] Setting project: ${PROJECT_ID}"
gcloud config set project "${PROJECT_ID}" >/dev/null

echo "[info] Enabling Vertex AI API (if not already)"
gcloud services enable aiplatform.googleapis.com >/dev/null

echo "[info] Creating service account if missing: ${SA_EMAIL}"
if ! gcloud iam service-accounts list --format="value(email)" | grep -q "^${SA_EMAIL}$"; then
  gcloud iam service-accounts create "${SA_ID}" --display-name "${SA_NAME}" >/dev/null
fi

echo "[info] Granting project roles to ${SA_EMAIL}"
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${SA_EMAIL}" --role="roles/aiplatform.admin" >/dev/null
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${SA_EMAIL}" --role="roles/iam.securityAdmin" >/dev/null
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${SA_EMAIL}" --role="roles/serviceusage.serviceUsageAdmin" >/dev/null
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${SA_EMAIL}" --role="roles/serviceAccountAdmin" >/dev/null

if [[ -n "${ORG_ID}" && -n "${CONSTRAINT_NAME}" ]]; then
  echo "[info] Attempting to delete org policy ${CONSTRAINT_NAME} on org ${ORG_ID} (may require org admin)"
  gcloud org-policies delete "${CONSTRAINT_NAME}" --organization="${ORG_ID}" || true
fi

echo "[info] Generating ADC key at /tmp/vertex-sa-key.json"
gcloud iam service-accounts keys create /tmp/vertex-sa-key.json \
  --iam-account "${SA_EMAIL}" >/dev/null

echo "[info] Base64 for Vercel (keep secret):"
base64 -w0 /tmp/vertex-sa-key.json
echo
echo "[next] Set in Vercel for apex-os-vibe:"
echo "  GOOGLE_APPLICATION_CREDENTIALS_BASE64=<above>"
echo "  VERTEX_PROJECT_ID=${PROJECT_ID}"
echo "  VERTEX_LOCATION=europe-west2"
echo "  VERTEX_MODEL=gemini-2.5-pro"
echo "Then redeploy: npx vercel --prod --scope nicos-projects-81a407b9 --yes"
