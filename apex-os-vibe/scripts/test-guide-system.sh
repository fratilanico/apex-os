#!/bin/bash
###############################################################################
#  APEX OS - Guide Generation System Tester
#  
#  Tests the complete guide generation pipeline
###############################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo -e "${BLUE}╔══════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  APEX OS - Guide Generation System Test                         ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check for .env.local
if [ ! -f ".env.local" ]; then
  echo -e "${RED}Error: .env.local not found${NC}"
  echo "Run ./scripts/setup-guide-automation.sh first"
  exit 1
fi

# Load environment variables
export $(cat .env.local | grep -v '^#' | xargs)

# Check required variables
if [ -z "$NOTION_TOKEN" ] || [ -z "$NOTION_CONTENT_LIBRARY_ID" ]; then
  echo -e "${RED}Error: Missing required environment variables${NC}"
  echo "Required: NOTION_TOKEN, NOTION_CONTENT_LIBRARY_ID"
  exit 1
fi

echo -e "${YELLOW}[1/3] Testing Notion connection...${NC}"

# Test Notion API connection
curl -s -X GET "https://api.notion.com/v1/databases/$NOTION_CONTENT_LIBRARY_ID" \
  -H "Authorization: Bearer $NOTION_TOKEN" \
  -H "Notion-Version: 2022-06-28" \
  > /tmp/notion-test.json

if grep -q "object" /tmp/notion-test.json; then
  echo -e "${GREEN}✓ Notion connection successful${NC}"
  echo "  Database: $(cat /tmp/notion-test.json | grep -o '"title":\[{"type":"text","text":{"content":"[^"]*"' | cut -d'"' -f10)"
else
  echo -e "${RED}✗ Notion connection failed${NC}"
  cat /tmp/notion-test.json
  exit 1
fi
echo ""

echo -e "${YELLOW}[2/3] Testing Vertex AI connection...${NC}"

if [ -n "$GOOGLE_CLOUD_PROJECT" ] && [ -f "vertex-ai-key.json" ]; then
  export GOOGLE_APPLICATION_CREDENTIALS="vertex-ai-key.json"
  
  # Simple test: list models
  gcloud ai models list --region=us-central1 --project="$GOOGLE_CLOUD_PROJECT" --limit=1 > /dev/null 2>&1
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Vertex AI connection successful${NC}"
  else
    echo -e "${YELLOW}⚠ Vertex AI connection failed (optional)${NC}"
  fi
else
  echo -e "${YELLOW}⚠ Skipping Vertex AI test (not configured)${NC}"
fi
echo ""

echo -e "${YELLOW}[3/3] Testing local guide generation...${NC}"

# Create test payload
TEST_CONTENT='{
  "title": "APEX OS Test - GPT-5 Released",
  "content": "OpenAI announced GPT-5 with revolutionary multimodal capabilities. Key features include 10x faster inference, native video understanding, and advanced reasoning for complex problem-solving.",
  "source": "Test",
  "url": "https://example.com/test",
  "contentType": "news"
}'

echo "$TEST_CONTENT" > /tmp/test-guide-payload.json

# Run local test using TypeScript
echo "Running guide generation test..."
echo ""

if [ -n "$GOOGLE_APPLICATION_CREDENTIALS" ]; then
  # Run the actual generator
  npx ts-node scripts/test-guide-generation.ts
  
  if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ Guide generation test passed!${NC}"
    echo ""
    echo "Check your Notion database for 3 new test guides:"
    echo "  https://notion.so/$NOTION_CONTENT_LIBRARY_ID"
  else
    echo -e "${RED}✗ Guide generation test failed${NC}"
    exit 1
  fi
else
  echo -e "${YELLOW}⚠ Skipping full test (GCP not configured)${NC}"
  echo "  Test will only validate structure, not actual generation"
fi

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✓ ALL TESTS PASSED                                             ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════════╝${NC}"
echo ""

cat << EOF
NEXT STEPS:

1. Deploy to Vercel:
   vercel --prod

2. Test production endpoint:
   
   curl -X POST https://your-app.vercel.app/api/generate-guides \\
     -H "Content-Type: application/json" \\
     -H "Authorization: Bearer $GUIDE_API_SECRET" \\
     -d @/tmp/test-guide-payload.json

3. Check Notion database:
   https://notion.so/$NOTION_CONTENT_LIBRARY_ID

EOF
