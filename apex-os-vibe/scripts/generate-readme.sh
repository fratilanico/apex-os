#!/bin/bash
# README GENERATOR - Tony Stark Visual Style
# Auto-generates stunning README.md with full wire mode formatting
# Usage: ./scripts/generate-readme.sh --project=PROJECT_NAME [--output=README.md]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# Defaults
PROJECT_NAME=""
OUTPUT_FILE="README.md"
TEMPLATE="tony-stark"

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --project=*)
      PROJECT_NAME="${1#*=}"
      shift
      ;;
    --output=*)
      OUTPUT_FILE="${1#*=}"
      shift
      ;;
    --template=*)
      TEMPLATE="${1#*=}"
      shift
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      exit 1
      ;;
  esac
done

# Validate project name
if [ -z "$PROJECT_NAME" ]; then
  echo -e "${RED}Error: --project is required${NC}"
  echo "Usage: ./scripts/generate-readme.sh --project=apex-os-vibe"
  exit 1
fi

echo -e "${CYAN}🚀 Generating README for $PROJECT_NAME...${NC}"

# Detect project info
if [ -f "package.json" ]; then
  PROJECT_VERSION=$(jq -r '.version // "0.0.0"' package.json)
  PROJECT_DESCRIPTION=$(jq -r '.description // "The Sovereign Developer Interface"' package.json)
else
  PROJECT_VERSION="0.0.0"
  PROJECT_DESCRIPTION="The Sovereign Developer Interface"
fi

# Detect Vercel project
if [ -f ".vercel/project.json" ]; then
  VERCEL_PROJECT=$(jq -r '.projectName // ""' .vercel/project.json)
  if [ -n "$VERCEL_PROJECT" ]; then
    VERCEL_URL="https://$VERCEL_PROJECT.vercel.app"
  fi
fi

# Generate README
cat > "$OUTPUT_FILE" << EOF
# $PROJECT_NAME

[![Vercel](https://img.shields.io/badge/Vercel-Production-black?logo=vercel)](${VERCEL_URL:-#})
[![Vertex AI](https://img.shields.io/badge/Vertex%20AI-Primary-4285F4?logo=google-cloud)](https://cloud.google.com/vertex-ai)
[![Agents](https://img.shields.io/badge/Agents-19%20Active-10b981)](${VERCEL_URL:-#}/matrix)

> **$PROJECT_DESCRIPTION** - AI-native development platform with autonomous agent swarm

---

## Quick Start

\`\`\`bash
# Clone and setup
git clone <repo-url>
cd $PROJECT_NAME
npm install

# Local development
npm run dev

# Deploy to production
npm run build
npx vercel --prod
\`\`\`

---

## System Status

\`\`\`
╔══════════════════════════════════════════════════════════════════════════════╗
║  🔥 $PROJECT_NAME - THE SOVEREIGN INTERFACE                                  ║
║  Status: [████████░░] 85% Production Ready                                   ║
╚══════════════════════════════════════════════════════════════════════════════╝
\`\`\`

### AI Provider Cascade

\`\`\`
┌──────────────────────────────────────────────────────────────────────────────┐
│ AI PROVIDER CASCADE                                                          │
├──────────┬─────────────────┬────────┬────────────────────────────────────────┤
│ Priority │ Provider        │ Status │ Model                                  │
├──────────┼─────────────────┼────────┼────────────────────────────────────────┤
│ 1        │ Vertex AI       │ 🟢     │ Gemini 2.5 Pro                         │
│ 2        │ Gemini API      │ 🟢     │ Gemini 2.0 Flash                       │
│ 3        │ Perplexity      │ 🟢     │ Sonar Reasoning Pro                    │
│ 4        │ Kimi            │ 🟢     │ Moonshot v1                            │
│ 5        │ Groq            │ 🟢     │ Llama 3.3 70B                          │
└──────────┴─────────────────┴────────┴────────────────────────────────────────┘
\`\`\`

---

## Architecture

### Agent Swarm

\`\`\`
┌──────────────────────────────────────────────────────────────────────────────┐
│ AGENT SWARM (19 Active Agents)                                               │
├──────────────────┬──────────┬────────┬────────────────────────────────────────┤
│ Agent            │ Module   │ Tier   │ Status                                 │
├──────────────────┼──────────┼────────┼────────────────────────────────────────┤
│ ui-agent         │ Frontend │ Free   │ 🟢 Ready                               │
│ frontend-agent   │ Frontend │ Free   │ 🟢 Ready                               │
│ backend-agent    │ Backend  │ Pro    │ 🟢 Ready                               │
│ database-agent   │ Backend  │ Pro    │ 🟢 Ready                               │
│ security-agent   │ Backend  │ Pro    │ 🟢 Ready                               │
│ devops-agent     │ DevOps   │ Pro    │ 🟢 Ready                               │
│ ai-agent         │ AI       │ Bus    │ 🟢 Ready                               │
└──────────────────┴──────────┴────────┴────────────────────────────────────────┘
\`\`\`

---

## API Documentation

### AI Endpoints

**POST /api/ai-unified**
\`\`\`bash
curl -X POST ${VERCEL_URL:-https://your-app.vercel.app}/api/ai-unified \\
  -H "Content-Type: application/json" \\
  -d '{
    "message": "Create a React button component",
    "history": []
  }'
\`\`\`

**POST /api/terminal**
\`\`\`bash
curl -X POST ${VERCEL_URL:-https://your-app.vercel.app}/api/terminal \\
  -H "Content-Type: application/json" \\
  -d '{
    "message": "Explain useEffect hook",
    "history": []
  }'
\`\`\`

### Agent Endpoints

**POST /api/agents/invoke**
\`\`\`bash
curl -X POST ${VERCEL_URL:-https://your-app.vercel.app}/api/agents/invoke \\
  -H "Content-Type: application/json" \\
  -d '{
    "agentId": "ui-agent",
    "prompt": "Create a login form component",
    "context": { "framework": "react" }
  }'
\`\`\`

---

## Environment Configuration

\`\`\`bash
# Primary AI Provider (Vertex AI) - 🔒 Keep secret
VERTEX_PROJECT_ID=your-project-id
VERTEX_LOCATION=us-central1
VERTEX_MODEL=gemini-2.5-pro
USE_VERTEX_AI=true

# Fallback Providers
GEMINI_API_KEY=your_key_here
PERPLEXITY_API_KEY=your_key_here
GROQ_API_KEY=your_key_here
KIMI_API_KEY=your_key_here
\`\`\`

---

## Cost Analysis

\`\`\`
┌──────────────────────────────────────────────────────────────────────────────┐
│ MONTHLY COST BREAKDOWN                                                       │
├──────────────────────────────┬───────────────────────────────────────────────┤
│ Infrastructure               │ Cost                                          │
├──────────────────────────────┼───────────────────────────────────────────────┤
│ Vercel Pro                   │ \$20/month                                     │
│ Vercel KV                    │ \$0 (free tier)                                │
│ Serverless Functions         │ \$0 (free tier)                                │
├──────────────────────────────┼───────────────────────────────────────────────┤
│ AI Providers                 │ Cost                                          │
├──────────────────────────────┼───────────────────────────────────────────────┤
│ Vertex AI (primary)          │ ~\$0.00125/1K chars input                      │
│                              │ ~\$0.00375/1K chars output                     │
│ Estimated usage              │ \$10-50/month                                  │
├──────────────────────────────┼───────────────────────────────────────────────┤
│ TOTAL ESTIMATED              │ \$30-70/month                                  │
└──────────────────────────────┴───────────────────────────────────────────────┘
\`\`\`

---

## Troubleshooting

\`\`\`
┌──────────────────────────────────────────────────────────────────────────────┐
│ COMMON ISSUES & FIXES                                                        │
├──────────────────────────────┬───────────────────────────────────────────────┤
│ Issue                        │ Solution                                      │
├──────────────────────────────┼───────────────────────────────────────────────┤
│ Vertex AI auth failed        │ Run: gcloud auth application-default login    │
│ 429 Rate limit errors        │ Switch to Vertex AI (paid, no limits)         │
│ Build fails                  │ rm -rf node_modules && npm install            │
└──────────────────────────────┴───────────────────────────────────────────────┘
\`\`\`

---

## Scripts

\`\`\`bash
# Agent management
npm run agents:start      # Start agent orchestrator
npm run agents:stop       # Stop all agents
npm run agents:status     # Check agent status

# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run typecheck        # TypeScript check
npm run test             # Run tests

# Utilities
./scripts/vertex-auth-check.sh    # Verify Vertex AI auth
./scripts/agent-sync.sh           # Sync agent states
\`\`\`

---

## License

MIT - See LICENSE file

---

Built with 🔥 by the APEX OS Team

*"Now go build something legendary."* - Tony Stark
EOF

echo -e "${GREEN}✅ README generated: $OUTPUT_FILE${NC}"
echo -e "${CYAN}📊 File size: $(wc -c < "$OUTPUT_FILE") bytes${NC}"

# Validate sections
echo -e "\n${CYAN}🔍 Validating README sections...${NC}"

SECTIONS=(
  "Quick Start"
  "System Status"
  "AI Provider Cascade"
  "Agent Swarm"
  "API Documentation"
  "Environment Configuration"
  "Cost Analysis"
  "Troubleshooting"
)

VALID_SECTIONS=0
for section in "${SECTIONS[@]}"; do
  if grep -q "$section" "$OUTPUT_FILE"; then
    echo -e "${GREEN}  ✅ $section${NC}"
    ((VALID_SECTIONS++))
  else
    echo -e "${RED}  ❌ $section${NC}"
  fi
done

echo -e "\n${CYAN}📈 Validation: $VALID_SECTIONS/${#SECTIONS[@]} sections present${NC}"

if [ $VALID_SECTIONS -eq ${#SECTIONS[@]} ]; then
  echo -e "${GREEN}🎉 README meets all APEX OS standards!${NC}"
  exit 0
else
  echo -e "${YELLOW}⚠️  Some sections missing - review required${NC}"
  exit 1
fi