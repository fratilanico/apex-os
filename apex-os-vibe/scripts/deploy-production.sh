#!/bin/bash
# DEPLOYMENT SCRIPT - NEVER STOP EXECUTING
# Deploys apex-os-vibe to production

echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║  🚀 DEPLOYMENT SCRIPT - ACTIVATED                                            ║"
echo "║  Status: [████████████████████] 100% READY                                   ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""

cd /Users/nico/apex-os-vibe

echo "🔧 Step 1: Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🚀 Step 2: Deploying to Vercel..."
    npx vercel --prod --yes
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "╔══════════════════════════════════════════════════════════════════════════════╗"
        echo "║  ✅ DEPLOYMENT SUCCESSFUL                                                    ║"
        echo "╚══════════════════════════════════════════════════════════════════════════════╝"
        echo ""
        echo "Application deployed to production!"
    else
        echo "❌ Deployment failed"
        exit 1
    fi
else
    echo "❌ Build failed - fix errors first"
    exit 1
fi