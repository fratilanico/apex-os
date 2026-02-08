#!/bin/bash
###############################################################################
#  APEX OS - AUTOMATED GUIDE GENERATION SETUP
#  
#  This script automates EVERYTHING:
#  1. Creates Notion database (via API)
#  2. Sets up Google Cloud Vertex AI
#  3. Configures environment variables
#  4. Deploys to Vercel
#
#  Usage: ./scripts/setup-guide-automation.sh
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ASCII Header
cat << "EOF"
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║  APEX OS - AUTOMATED GUIDE GENERATION SETUP                     ║
║  Complete automation - sit back and watch                       ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
EOF

echo ""
echo -e "${BLUE}Starting automated setup...${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo -e "${RED}Error: Must run from apex-os-vibe root directory${NC}"
  exit 1
fi

# Step 1: Check prerequisites
echo -e "${YELLOW}[1/7] Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
  echo -e "${RED}Error: Node.js not installed${NC}"
  exit 1
fi

if ! command -v gcloud &> /dev/null; then
  echo -e "${YELLOW}Warning: gcloud not installed. Will skip GCP setup.${NC}"
  SKIP_GCP=true
else
  SKIP_GCP=false
fi

if ! command -v vercel &> /dev/null; then
  echo -e "${YELLOW}Warning: Vercel CLI not installed. Installing...${NC}"
  npm i -g vercel
fi

echo -e "${GREEN}✓ Prerequisites checked${NC}"
echo ""

# Step 2: Interactive credential collection
echo -e "${YELLOW}[2/7] Collecting credentials...${NC}"
echo ""

# Notion token
echo -e "${BLUE}We need your Notion integration token.${NC}"
echo "Get it from: https://www.notion.so/my-integrations"
echo ""
read -p "Notion Integration Token (secret_... or ntn_...): " NOTION_TOKEN

# Accept both old (secret_) and new (ntn_) token formats
if [[ ! $NOTION_TOKEN =~ ^(secret_|ntn_) ]]; then
  echo -e "${RED}Error: Invalid Notion token format${NC}"
  echo "Token should start with 'secret_' or 'ntn_'"
  exit 1
fi

# GCP Project ID
if [ "$SKIP_GCP" = false ]; then
  echo ""
  echo -e "${BLUE}Enter your Google Cloud Project ID:${NC}"
  read -p "GCP Project ID: " GCP_PROJECT_ID
else
  GCP_PROJECT_ID=""
fi

# Generate API secret
echo ""
echo -e "${BLUE}Generating API secret...${NC}"
GUIDE_API_SECRET=$(openssl rand -base64 32)
echo -e "${GREEN}✓ API secret generated${NC}"

echo ""
echo -e "${GREEN}✓ Credentials collected${NC}"
echo ""

# Step 3: Create Notion database
echo -e "${YELLOW}[3/7] Creating Notion database...${NC}"

node scripts/notion-database-creator.mjs "$NOTION_TOKEN"

if [ $? -ne 0 ]; then
  echo -e "${RED}Failed to create Notion database${NC}"
  exit 1
fi

# Read the database ID from the output file
NOTION_DB_ID=$(cat .notion-db-id.tmp)
rm .notion-db-id.tmp

echo -e "${GREEN}✓ Notion database created: $NOTION_DB_ID${NC}"
echo ""

# Step 4: Setup Google Cloud (if available)
if [ "$SKIP_GCP" = false ]; then
  echo -e "${YELLOW}[4/7] Setting up Google Cloud Vertex AI...${NC}"
  
  ./scripts/setup-gcp-vertex.sh "$GCP_PROJECT_ID"
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to setup GCP${NC}"
    exit 1
  fi
  
  echo -e "${GREEN}✓ GCP Vertex AI configured${NC}"
else
  echo -e "${YELLOW}[4/7] Skipping GCP setup (gcloud not installed)${NC}"
fi
echo ""

# Step 5: Create .env.local file
echo -e "${YELLOW}[5/7] Creating environment configuration...${NC}"

cat > .env.local << EOL
# APEX OS - Guide Generation Configuration
# Generated: $(date)

# Notion Configuration
NOTION_TOKEN=$NOTION_TOKEN
NOTION_CONTENT_LIBRARY_ID=$NOTION_DB_ID

# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT=${GCP_PROJECT_ID:-your-project-id}
$(if [ "$SKIP_GCP" = false ] && [ -f "vertex-ai-key.json" ]; then
  echo "GOOGLE_APPLICATION_CREDENTIALS_BASE64=$(cat vertex-ai-key.json | base64)"
fi)

# API Security
GUIDE_API_SECRET=$GUIDE_API_SECRET

# Existing variables (if any)
$(if [ -f ".env.local.backup" ]; then
  grep -v "^NOTION_\|^GOOGLE_\|^GUIDE_" .env.local.backup || true
fi)
EOL

echo -e "${GREEN}✓ Environment configuration created${NC}"
echo ""

# Step 6: Deploy to Vercel
echo -e "${YELLOW}[6/7] Deploying to Vercel...${NC}"
echo ""

read -p "Deploy to Vercel now? (y/n): " DEPLOY_NOW

if [[ $DEPLOY_NOW == "y" || $DEPLOY_NOW == "Y" ]]; then
  # Add environment variables to Vercel
  echo "Adding environment variables to Vercel..."
  
  vercel env add NOTION_TOKEN production <<< "$NOTION_TOKEN"
  vercel env add NOTION_CONTENT_LIBRARY_ID production <<< "$NOTION_DB_ID"
  vercel env add GOOGLE_CLOUD_PROJECT production <<< "$GCP_PROJECT_ID"
  vercel env add GUIDE_API_SECRET production <<< "$GUIDE_API_SECRET"
  
  if [ "$SKIP_GCP" = false ] && [ -f "vertex-ai-key.json" ]; then
    GCP_CREDS_BASE64=$(cat vertex-ai-key.json | base64)
    vercel env add GOOGLE_APPLICATION_CREDENTIALS_BASE64 production <<< "$GCP_CREDS_BASE64"
  fi
  
  echo ""
  echo "Deploying..."
  vercel --prod
  
  echo -e "${GREEN}✓ Deployed to Vercel${NC}"
else
  echo -e "${YELLOW}Skipping deployment. Run 'vercel --prod' when ready.${NC}"
fi
echo ""

# Step 7: Summary & next steps
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                                  ║${NC}"
echo -e "${GREEN}║  ✓ SETUP COMPLETE!                                               ║${NC}"
echo -e "${GREEN}║                                                                  ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════════╝${NC}"
echo ""

cat << EOF
┌──────────────────────────────────────────────────────────────────┐
│  WHAT WAS CONFIGURED                                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ✓ Notion Database Created                                       │
│    Database ID: $NOTION_DB_ID
│                                                                  │
│  ✓ Environment Variables Set                                     │
│    File: .env.local                                              │
│                                                                  │
$(if [ "$SKIP_GCP" = false ]; then
  echo "│  ✓ Google Cloud Vertex AI Configured                            │"
  echo "│    Project: $GCP_PROJECT_ID"
fi)
│                                                                  │
│  ✓ API Secret Generated                                          │
│    Keep this safe: $GUIDE_API_SECRET
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

NEXT STEPS:

1. Test the endpoint:
   
   curl -X POST https://your-app.vercel.app/api/generate-guides \\
     -H "Content-Type: application/json" \\
     -H "Authorization: Bearer $GUIDE_API_SECRET" \\
     -d '{
       "title": "Test Article",
       "content": "This is a test...",
       "source": "Test",
       "url": "https://example.com"
     }'

2. Connect to your content hub:
   
   Add this webhook call in your news-source-hub when processing stories.
   See GUIDE_GENERATION_SETUP.md for integration code.

3. Check Notion:
   
   Your database is ready at:
   https://notion.so/$NOTION_DB_ID

CONFIGURATION FILES:
  - .env.local (local environment)
  - vertex-ai-key.json (GCP credentials) - DO NOT COMMIT
  
DOCUMENTATION:
  - GUIDE_GENERATION_SETUP.md (full details)
  - QUICK_START_GUIDE_GENERATION.md (quick reference)

EOF

# Save configuration summary
cat > SETUP_SUMMARY.txt << EOF
APEX OS - Guide Generation Setup Summary
Generated: $(date)

Notion Database ID: $NOTION_DB_ID
API Secret: $GUIDE_API_SECRET
GCP Project: ${GCP_PROJECT_ID:-not configured}

API Endpoint: https://your-app.vercel.app/api/generate-guides

Test Command:
curl -X POST https://your-app.vercel.app/api/generate-guides \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $GUIDE_API_SECRET" \\
  -d '{"title":"Test","content":"Test content","source":"Test","url":"https://example.com"}'
EOF

echo -e "${GREEN}Configuration summary saved to: SETUP_SUMMARY.txt${NC}"
echo ""
echo -e "${BLUE}Setup complete! 🚀${NC}"
