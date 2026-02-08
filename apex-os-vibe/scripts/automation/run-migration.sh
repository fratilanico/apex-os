#!/bin/bash
# Try different regions until one works
REGIONS=("eu-central-1" "us-east-1" "us-west-1" "eu-west-1" "eu-west-2" "ap-southeast-1")
PASSWORD="23051234EliasAPEX"
PROJECT="lglhpsfrkhcbnecwduuk"

for region in "${REGIONS[@]}"; do
  echo "Trying region: $region"
  psql "postgresql://postgres.${PROJECT}:${PASSWORD}@aws-0-${region}.pooler.supabase.com:6543/postgres" -c "SELECT 1" 2>/dev/null && {
    echo "Connected! Running migration..."
    psql "postgresql://postgres.${PROJECT}:${PASSWORD}@aws-0-${region}.pooler.supabase.com:6543/postgres" -f supabase/migrations/20260129_gemini_embeddings.sql
    exit 0
  }
done
echo "Could not connect to any region"
