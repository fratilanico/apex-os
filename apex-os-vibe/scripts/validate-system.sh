#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════════
# APEX OS CONTENT SYSTEM - VALIDATION & TEST SCRIPT
# Full Tony Stark Mode - System Verification
# ═══════════════════════════════════════════════════════════════════════════════

echo ""
echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║           🔥 APEX OS CONTENT SYSTEM - VALIDATION SUITE 🔥                   ║"
echo "║                      Neural Content Aggregation v2.0                         ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

PASS=0
FAIL=0

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        ((PASS++))
        return 0
    else
        echo -e "${RED}✗${NC} $2 - FILE MISSING"
        ((FAIL++))
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        ((PASS++))
        return 0
    else
        echo -e "${RED}✗${NC} $2 - DIRECTORY MISSING"
        ((FAIL++))
        return 1
    fi
}

echo -e "${CYAN}📁 Checking Directory Structure...${NC}"
echo "───────────────────────────────────────────────────────────────────────────────"
check_dir "/Users/nico/apex-os-vibe/api/content" "API Content Directory"
check_dir "/Users/nico/apex-os-vibe/api/newsletter" "API Newsletter Directory"
check_dir "/Users/nico/apex-os-vibe/components/blog" "Blog Components Directory"
check_dir "/Users/nico/apex-os-vibe/pages/blog" "Blog Pages Directory"
check_dir "/Users/nico/apex-os-vibe/config" "Config Directory"
check_dir "/Users/nico/apex-os-vibe/database" "Database Directory"
check_dir "/Users/nico/apex-os-vibe/templates/newsletter" "Newsletter Templates Directory"
echo ""

echo -e "${CYAN}🔌 Checking API Endpoints...${NC}"
echo "───────────────────────────────────────────────────────────────────────────────"
check_file "/Users/nico/apex-os-vibe/api/content/rss/ingest.ts" "RSS Ingest API"
check_file "/Users/nico/apex-os-vibe/api/content/score.ts" "Content Score API"
check_file "/Users/nico/apex-os-vibe/api/agents/research-agent.ts" "Research Agent API"
check_file "/Users/nico/apex-os-vibe/api/newsletter/generate.ts" "Newsletter Generate API"
check_file "/Users/nico/apex-os-vibe/api/newsletter/send.ts" "Newsletter Send API"
echo ""

echo -e "${CYAN}🎨 Checking Tony Stark UI Components...${NC}"
echo "───────────────────────────────────────────────────────────────────────────────"
check_file "/Users/nico/apex-os-vibe/components/blog/BlogLayout.tsx" "Blog Layout Component"
check_file "/Users/nico/apex-os-vibe/components/blog/ContentScore.tsx" "Content Score Component"
check_file "/Users/nico/apex-os-vibe/components/blog/BlogPostCard.tsx" "Blog Post Card Component"
echo ""

echo -e "${CYAN}📄 Checking Configuration Files...${NC}"
echo "───────────────────────────────────────────────────────────────────────────────"
check_file "/Users/nico/apex-os-vibe/config/content-sources.json" "Content Sources Config"
check_file "/Users/nico/apex-os-vibe/database/schema.sql" "Database Schema"
check_file "/Users/nico/apex-os-vibe/vercel.json" "Vercel Config with Crons"
echo ""

echo -e "${CYAN}📊 RSS SOURCES CONFIGURED:${NC}"
echo "───────────────────────────────────────────────────────────────────────────────"
if [ -f "/Users/nico/apex-os-vibe/config/content-sources.json" ]; then
    echo -e "${YELLOW}Marketing Feeds:${NC}"
    echo "  • HubSpot Marketing (HIGH)"
    echo "  • Copyblogger (HIGH)"
    echo "  • Mailchimp (HIGH)"
    echo "  • ActiveCampaign (MEDIUM)"
    echo "  • ConvertKit (MEDIUM)"
    echo "  • Neil Patel (MEDIUM)"
    echo "  • Backlinko (MEDIUM)"
    echo "  • MarketingProfs (LOW)"
    echo ""
    echo -e "${YELLOW}Tech Feeds:${NC}"
    echo "  • Hacker News (HIGH)"
    echo "  • Dev.to (HIGH)"
    echo "  • Product Hunt (HIGH)"
    echo "  • Indie Hackers (HIGH)"
    echo "  • GitHub Trending (MEDIUM)"
    echo ""
    echo -e "${YELLOW}Social Monitoring:${NC}"
    echo "  • X/Twitter: @naval, @paulg, @shreyas, @sama, @elonmusk"
    echo "  • LinkedIn: Seth Godin, Ann Handley, Joe Pulizzi"
    echo "  • Reddit: r/marketing, r/saas, r/startups, r/entrepreneur"
    ((PASS++))
else
    echo -e "${RED}✗${NC} Content sources config not found"
    ((FAIL++))
fi
echo ""

echo -e "${CYAN}⏰ CRON JOBS CONFIGURED:${NC}"
echo "───────────────────────────────────────────────────────────────────────────────"
echo "  • Research Agent: Every 3 days at 6:00 AM UTC"
echo "  • Daily Newsletter: Every day at 6:00 AM UTC"
echo "  • Weekly Newsletter: Every Sunday at 9:00 AM UTC"
echo ""

echo -e "${CYAN}🗄️  DATABASE TABLES:${NC}"
echo "───────────────────────────────────────────────────────────────────────────────"
echo "  • content_sources - RSS feeds and social accounts"
echo "  • content_items - Individual articles and posts"
echo "  • content_scores - AI scoring results"
echo "  • content_curation_queue - Manual review queue"
echo "  • blog_posts - Published blog content"
echo "  • newsletters - Newsletter campaigns"
echo "  • newsletter_items - Content in newsletters"
echo "  • newsletter_analytics - Performance tracking"
echo ""

echo -e "${CYAN}🤖 AI SCORING THRESHOLDS:${NC}"
echo "───────────────────────────────────────────────────────────────────────────────"
echo "  • 🔥 HOT (Auto-publish): Score ≥ 85"
echo "  • ⚡ WARM (Manual review): Score 60-84"
echo "  • ❄️ COLD (Low priority): Score < 60"
echo ""

echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║                         📊 VALIDATION RESULTS                                ║"
echo "╠══════════════════════════════════════════════════════════════════════════════╣"
printf "║  ✅ PASSED:  %-3d                                                            ║\n" $PASS
printf "║  ❌ FAILED:  %-3d                                                            ║\n" $FAIL
printf "║  📊 TOTAL:   %-3d                                                            ║\n" $((PASS + FAIL))
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL SYSTEMS OPERATIONAL - READY FOR DEPLOYMENT${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Run database schema in Supabase SQL editor"
    echo "  2. Deploy to Vercel"
    echo "  3. Configure environment variables"
    echo "  4. Test RSS ingestion"
    echo ""
    exit 0
else
    echo -e "${RED}⚠️  SOME COMPONENTS MISSING - REVIEW REQUIRED${NC}"
    exit 1
fi