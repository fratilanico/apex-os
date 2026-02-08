/////#!/bin/bash
###############################################################################
#  APEX OS - ONE-CLICK SETUP
#  
#  Absolutely minimal interaction required
#  Just run and follow prompts
###############################################################################

set -e

cat << "EOF"
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║   █████╗ ██████╗ ███████╗██╗  ██╗     ██████╗ ███████╗                     ║
║  ██╔══██╗██╔══██╗██╔════╝╚██╗██╔╝    ██╔═══██╗██╔════╝                     ║
║  ███████║██████╔╝█████╗   ╚███╔╝     ██║   ██║███████╗                     ║
║  ██╔══██║██╔═══╝ ██╔══╝   ██╔██╗     ██║   ██║╚════██║                     ║
║  ██║  ██║██║     ███████╗██╔╝ ██╗    ╚██████╔╝███████║                     ║
║  ╚═╝  ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝     ╚═════╝ ╚══════╝                     ║
║                                                                              ║
║  AUTOMATED GUIDE GENERATION - ONE-CLICK SETUP                                ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

This script will:
  1. Create your Notion database automatically
  2. Setup Google Cloud Vertex AI (if you have gcloud)
  3. Configure all environment variables
  4. Deploy to Vercel (optional)
  5. Run tests

You'll need:
  • Notion integration token (we'll help you get it)
  • Google Cloud project (optional, for AI generation)

Press ENTER to start, or Ctrl+C to cancel
EOF

read

# Make executable
chmod +x scripts/setup-guide-automation.sh
chmod +x scripts/setup-gcp-vertex.sh
chmod +x scripts/test-guide-system.sh

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "Error: Node.js is required"
  echo "Install from: https://nodejs.org"
  exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules/@notionhq" ]; then
  echo "Installing dependencies..."
  npm install
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  STEP 1: Get Notion Integration Token"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Opening Notion integrations page in your browser..."
echo ""

# Open Notion integrations page
echo "Trying to open browser..."
if command -v open &> /dev/null; then
  open "https://www.notion.so/my-integrations" 2>/dev/null &
elif command -v xdg-open &> /dev/null; then
  xdg-open "https://www.notion.so/my-integrations" 2>/dev/null &
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  📋 Open this URL in your browser:"
echo "     https://www.notion.so/my-integrations"
echo ""
echo "  🖱️  Then follow these steps:"
echo "     1. Click '+ New integration'"
echo "     2. Name it: 'Source Code Guide Generator'"
echo "     3. Select your workspace"
echo "     4. Click 'Submit'"
echo "     5. Copy the 'Internal Integration Token'"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Then come back here and paste the token."
echo ""

# Run the main setup script
./scripts/setup-guide-automation.sh

# Run tests
echo ""
read -p "Run tests now? (y/n): " RUN_TESTS

if [[ $RUN_TESTS == "y" || $RUN_TESTS == "Y" ]]; then
  ./scripts/test-guide-system.sh
fi

echo ""
cat << "EOF"
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║  ✓ SETUP COMPLETE!                                                           ║
║                                                                              ║
║  Your automated guide generation system is ready.                            ║
║                                                                              ║
║  Next: Connect to your content hub                                           ║
║  See: GUIDE_GENERATION_SETUP.md                                              ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
EOF
