#!/usr/bin/env bash
# Test the waitlist notification flow via the Resend-powered API route.
# Requirements:
#   - RESEND_API_KEY set in environment (export RESEND_API_KEY=...)
#   - FROM_EMAIL set (e.g., from=apex@yourdomain.com)
#   - NOTIFY_EMAIL set (internal notifications)
#   - Local dev server running (npm run dev) or deploy preview URL

set -euo pipefail

API_URL="${API_URL:-http://localhost:5174/api/waitlist-notify}"

payload='{
  "payload": {
    "name": "Test Founder",
    "email": "founder@example.com",
    "phone": "+1 555 000 0000",
    "linkedin": "https://linkedin.com/in/test",
    "goal": "ship",
    "notes": "Testing the waitlist notification flow",
    "company": "TestCo",
    "role": "Founder",
    "industry": "saas",
    "companySize": "2-5",
    "experience": "3-5",
    "teamSize": "2-5",
    "revenueRange": "pre-revenue",
    "fundingStatus": "bootstrapped",
    "timeline": "immediately",
    "biggestChallenge": "speed",
    "ai_score": 88,
    "referral_code": "APEXTEST",
    "created_at": "'"'"$(date -Iseconds)'"'""
  }
}'

echo "Posting test payload to: $API_URL"
curl -s -o /dev/null -w "HTTP %{http_code}\n" -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "$payload"

echo "If you see HTTP 200, emails were queued via Resend. Check your inbox and the recipient inbox."
