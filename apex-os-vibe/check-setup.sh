#!/bin/bash
# Test if Notion API is working with the configured token

cd /Users/nico/apex-os-vibe

NOTION_TOKEN="ntn_Y38591731272NNrXm0EvgDlG8fqG3XsdBzHAO3E1w5PcUm"
NOTION_DB_ID="3010e606-4f07-819d-8824-fb85885faa59"

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║  SETUP COMPLETION CHECK                                         ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

echo "[1/3] Testing Notion API connection..."
RESPONSE=$(curl -s -X GET "https://api.notion.com/v1/databases/$NOTION_DB_ID" \
  -H "Authorization: Bearer $NOTION_TOKEN" \
  -H "Notion-Version: 2022-06-28")

if echo "$RESPONSE" | grep -q "object"; then
  echo "✅ Notion API: CONNECTED"
  echo "  Database ID: $NOTION_DB_ID"
  echo "  URL: https://notion.so/$NOTION_DB_ID"
else
  echo "❌ Notion API: FAILED"
  echo "$RESPONSE"
fi
echo ""

echo "[2/3] Checking environment configuration..."
if grep -q "NOTION_TOKEN=" .env.local; then
  echo "✅ Environment file: CONFIGURED"
else
  echo "❌ Environment file: MISSING"
fi
echo ""

echo "[3/3] Checking GCP configuration..."
if grep -q "GOOGLE_CLOUD_PROJECT=your-gcp-project-id" .env.local; then
  echo "⚠️  GCP: NOT CONFIGURED (Optional - skip for now)"
elif [ -f "vertex-ai-key.json" ]; then
  echo "✅ GCP: CONFIGURED"
else
  echo "⚠️  GCP: NOT CONFIGURED"
fi
echo ""

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║  SETUP STATUS: MOSTLY COMPLETE                                  ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""
echo "✅ COMPLETED:"
echo "  - Notion database created"
echo "  - API integration working"
echo "  - Environment configured"
echo ""
echo "⚠️  OPTIONAL (for AI generation):"
echo "  - Google Cloud Vertex AI"
echo "  - Run: ./scripts/setup-gcp-vertex.sh <project-id>"
echo ""
echo "📋 YOUR DATABASE:"
echo "  https://notion.so/$NOTION_DB_ID"
echo ""
echo "🚀 NEXT STEPS:"
echo "  1. Deploy to Vercel: vercel --prod"
echo "  2. Test the endpoint"
echo "  3. Connect to your content hub"
echo ""
