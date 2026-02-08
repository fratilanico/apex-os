#!/bin/bash
# VERTEX AI AUTHENTICATION & HEALTH CHECK SCRIPT
# P0 CRITICAL - Checks Google Cloud ADC + Vertex AI connectivity
# Usage: ./scripts/vertex-auth-check.sh

echo "🚀 VERTEX AI AUTHENTICATION CHECK - $(date)"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="${VERTEX_PROJECT_ID:-${GOOGLE_CLOUD_PROJECT:-${GCP_PROJECT_ID:-}}}"
LOCATION="${VERTEX_LOCATION:-${GOOGLE_CLOUD_LOCATION:-${GOOGLE_CLOUD_REGION:-us-central1}}}"
MODEL="${VERTEX_MODEL:-gemini-2.5-pro}"

echo -e "\n📋 Configuration:"
echo "  Project ID: ${PROJECT_ID:-NOT SET}"
echo "  Location: $LOCATION"
echo "  Model: $MODEL"

# Check if gcloud is installed
echo -e "\n🔍 Checking gcloud CLI..."
if command -v gcloud &> /dev/null; then
    echo -e "${GREEN}✅ gcloud CLI: INSTALLED${NC}"
    gcloud --version | head -1
else
    echo -e "${RED}❌ gcloud CLI: NOT FOUND${NC}"
    echo "   Install: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check active account
echo -e "\n🔍 Checking Google Cloud authentication..."
ACTIVE_ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>/dev/null)
if [ -n "$ACTIVE_ACCOUNT" ]; then
    echo -e "${GREEN}✅ Active Account: $ACTIVE_ACCOUNT${NC}"
else
    echo -e "${RED}❌ No active Google Cloud account${NC}"
    echo "   Run: gcloud auth login"
    exit 1
fi

# Check Application Default Credentials (ADC)
echo -e "\n🔍 Checking Application Default Credentials (ADC)..."
ADC_FILE="$HOME/.config/gcloud/application_default_credentials.json"
if [ -f "$ADC_FILE" ]; then
    echo -e "${GREEN}✅ ADC file found: $ADC_FILE${NC}"
    # Check if it's valid JSON
    if python3 -c "import json; json.load(open('$ADC_FILE'))" 2>/dev/null; then
        echo -e "${GREEN}✅ ADC file is valid JSON${NC}"
    else
        echo -e "${YELLOW}⚠️  ADC file exists but may be corrupted${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  ADC file not found${NC}"
    echo "   Run: gcloud auth application-default login"
fi

# Check current project configuration
echo -e "\n🔍 Checking gcloud project configuration..."
GCLOUD_PROJECT=$(gcloud config get-value project 2>/dev/null)
if [ -n "$GCLOUD_PROJECT" ]; then
    echo -e "${GREEN}✅ gcloud project: $GCLOUD_PROJECT${NC}"
else
    echo -e "${YELLOW}⚠️  No default project set${NC}"
fi

# Verify project exists and is accessible
echo -e "\n🔍 Verifying project access..."
if [ -n "$PROJECT_ID" ]; then
    PROJECT_INFO=$(gcloud projects describe "$PROJECT_ID" --format="value(projectId,name)" 2>/dev/null)
    if [ -n "$PROJECT_INFO" ]; then
        echo -e "${GREEN}✅ Project accessible: $PROJECT_INFO${NC}"
    else
        echo -e "${RED}❌ Cannot access project: $PROJECT_ID${NC}"
        echo "   Check permissions or run: gcloud config set project $PROJECT_ID"
    fi
else
    echo -e "${YELLOW}⚠️  No project ID configured${NC}"
    echo "   Set VERTEX_PROJECT_ID or GOOGLE_CLOUD_PROJECT"
fi

# Test Vertex AI API access (if ADC is available)
echo -e "\n🔍 Testing Vertex AI API access..."
if [ -f "$ADC_FILE" ] && [ -n "$PROJECT_ID" ]; then
    # Get access token
    ACCESS_TOKEN=$(gcloud auth application-default print-access-token 2>/dev/null)
    if [ -n "$ACCESS_TOKEN" ]; then
        echo -e "${GREEN}✅ Successfully obtained access token${NC}"
        
        # Test Vertex AI endpoint
        echo -e "\n🧪 Testing Vertex AI generateContent endpoint..."
        VERTEX_RESPONSE=$(curl -s -w "\n%{http_code}" \
            -X POST "https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL}:generateContent" \
            -H "Authorization: Bearer $ACCESS_TOKEN" \
            -H "Content-Type: application/json" \
            -d '{
                "contents": [{"role": "user", "parts": [{"text": "Hello, respond with OK"}]}],
                "generationConfig": {"maxOutputTokens": 10}
            }' 2>/dev/null)
        
        HTTP_CODE=$(echo "$VERTEX_RESPONSE" | tail -n1)
        RESPONSE_BODY=$(echo "$VERTEX_RESPONSE" | sed '$d')
        
        if [ "$HTTP_CODE" = "200" ]; then
            echo -e "${GREEN}✅ Vertex AI API: HEALTHY${NC}"
            echo "   Response: $(echo "$RESPONSE_BODY" | python3 -c "import sys,json; print(json.load(sys.stdin)['candidates'][0]['content']['parts'][0]['text'][:50])" 2>/dev/null || echo 'OK')"
        else
            echo -e "${RED}❌ Vertex AI API: FAILED (HTTP $HTTP_CODE)${NC}"
            echo "   Error: $(echo "$RESPONSE_BODY" | python3 -c "import sys,json; print(json.load(sys.stdin).get('error',{}).get('message','Unknown error'))" 2>/dev/null || echo 'Unknown')"
        fi
    else
        echo -e "${RED}❌ Failed to obtain access token${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Skipping API test (ADC or project ID missing)${NC}"
fi

# Environment variables check
echo -e "\n📋 Environment Variables Status:"
ENV_VARS=("VERTEX_PROJECT_ID" "VERTEX_LOCATION" "VERTEX_MODEL" "GOOGLE_CLOUD_PROJECT" "GOOGLE_CLOUD_LOCATION" "USE_VERTEX_AI")
for var in "${ENV_VARS[@]}"; do
    if [ -n "${!var}" ]; then
        echo -e "${GREEN}✅ $var: SET${NC}"
    else
        echo -e "${YELLOW}⚠️  $var: NOT SET${NC}"
    fi
done

# Summary
echo -e "\n================================================"
echo "📊 VERTEX AI STATUS SUMMARY:"
echo ""

if [ -n "$ACTIVE_ACCOUNT" ] && [ -f "$ADC_FILE" ] && [ -n "$PROJECT_ID" ]; then
    echo -e "${GREEN}✅ READY FOR VERTEX AI DEPLOYMENT${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Ensure environment variables are set in Vercel:"
    echo "     - VERTEX_PROJECT_ID=$PROJECT_ID"
    echo "     - VERTEX_LOCATION=$LOCATION"
    echo "     - VERTEX_MODEL=$MODEL"
    echo "     - USE_VERTEX_AI=true"
    echo "  2. Deploy to Vercel: npx vercel --prod"
    echo "  3. Test endpoint: curl -X POST https://your-app.vercel.app/api/ai-unified"
    exit 0
else
    echo -e "${YELLOW}⚠️  VERTEX AI NOT FULLY CONFIGURED${NC}"
    echo ""
    echo "Required actions:"
    [ -z "$ACTIVE_ACCOUNT" ] && echo "  ❌ Run: gcloud auth login"
    [ ! -f "$ADC_FILE" ] && echo "  ❌ Run: gcloud auth application-default login"
    [ -z "$PROJECT_ID" ] && echo "  ❌ Set VERTEX_PROJECT_ID environment variable"
    exit 1
fi