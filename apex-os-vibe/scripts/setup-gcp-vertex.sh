#!/bin/bash
###############################################################################
#  APEX OS - Google Cloud Vertex AI Setup
#  
#  Automates GCP configuration for guide generation
###############################################################################

set -e

PROJECT_ID=$1

if [ -z "$PROJECT_ID" ]; then
  echo "Error: Project ID required"
  echo "Usage: ./setup-gcp-vertex.sh <project-id>"
  exit 1
fi

echo "Setting up Google Cloud Vertex AI..."
echo "Project: $PROJECT_ID"
echo ""

# Set the project
gcloud config set project "$PROJECT_ID"

# Enable Vertex AI API
echo "Enabling Vertex AI API..."
gcloud services enable aiplatform.googleapis.com

# Create service account
echo "Creating service account..."
gcloud iam service-accounts create guide-generator \
  --display-name="Guide Generator Service Account" \
  --project="$PROJECT_ID" \
  2>/dev/null || echo "Service account already exists"

# Grant permissions
echo "Granting permissions..."
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:guide-generator@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user" \
  --condition=None

# Create service account key
echo "Creating service account key..."
gcloud iam service-accounts keys create vertex-ai-key.json \
  --iam-account="guide-generator@${PROJECT_ID}.iam.gserviceaccount.com" \
  --project="$PROJECT_ID"

if [ -f "vertex-ai-key.json" ]; then
  echo "✓ Service account key created: vertex-ai-key.json"
  echo ""
  echo "⚠️  IMPORTANT: This file contains sensitive credentials"
  echo "   - DO NOT commit to git"
  echo "   - Store securely"
  echo "   - Added to .gitignore automatically"
  
  # Add to .gitignore if not already there
  if ! grep -q "vertex-ai-key.json" .gitignore 2>/dev/null; then
    echo "vertex-ai-key.json" >> .gitignore
  fi
else
  echo "Error: Failed to create service account key"
  exit 1
fi

echo ""
echo "✓ GCP Vertex AI setup complete!"
