#!/usr/bin/env bash
# Create a Vertex-enabled service account key and emit base64 for Vercel envs.
# Prereqs: org policy permits key creation; Vertex API enabled; SA has Vertex roles.

set -euo pipefail

PROJECT_ID="${PROJECT_ID:-project-ac3ab367-cee9-4de2-921}"
SA_EMAIL="${SA_EMAIL:-vertex-policy-editor@${PROJECT_ID}.iam.gserviceaccount.com}"
OUT=/tmp/vertex-sa-key.json

echo "[info] Project: ${PROJECT_ID}" >&2
echo "[info] Service Account: ${SA_EMAIL}" >&2

echo "[info] Creating key at ${OUT}" >&2
gcloud iam service-accounts keys create "${OUT}" --iam-account "${SA_EMAIL}"

echo "[info] Base64 below (use for GOOGLE_APPLICATION_CREDENTIALS_BASE64 in Vercel):" >&2
base64 -w0 "${OUT}"
echo >&2
echo "[next] Set in Vercel: GOOGLE_APPLICATION_CREDENTIALS_BASE64=<above>" >&2
echo "[next] Set: VERTEX_PROJECT_ID=${PROJECT_ID}, VERTEX_LOCATION=<region>, VERTEX_MODEL=<model>" >&2
echo "[next] Redeploy: npx vercel --prod --scope nicos-projects-81a407b9 --yes" >&2
