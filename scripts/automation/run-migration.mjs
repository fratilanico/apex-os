#!/usr/bin/env node
/**
 * Run Supabase migration directly via PostgreSQL connection.
 *
 * Usage:
 *   DATABASE_URL="postgresql://..." node scripts/run-migration.mjs
 *
 * Get your DATABASE_URL from Supabase Dashboard:
 *   Project Settings → Database → Connection string → URI
 */

import pg from 'pg';
import { readFileSync } from 'fs';

// Try to load from .env.local if it exists
function loadEnvFile() {
  try {
    const envContent = readFileSync('.env.local', 'utf-8');
    const lines = envContent.split('\n');
    for (const line of lines) {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  } catch {
    // .env.local doesn't exist, that's fine
  }
}

loadEnvFile();

// Try multiple common variable names
let DATABASE_URL = process.env.DATABASE_URL
  || process.env.SUPABASE_DB_URL
  || process.env.POSTGRES_URL
  || process.env.SUPABASE_DATABASE_URL;

// If no direct DB URL, try to construct from SUPABASE_URL + DB_PASSWORD
if (!DATABASE_URL && process.env.SUPABASE_URL && process.env.SUPABASE_DB_PASSWORD) {
  // Extract project ref from SUPABASE_URL (e.g., https://xyz.supabase.co)
  const match = process.env.SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/);
  if (match) {
    const projectRef = match[1];
    DATABASE_URL = `postgresql://postgres.${projectRef}:${process.env.SUPABASE_DB_PASSWORD}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`;
    console.log(`📦 Constructed DATABASE_URL from SUPABASE_URL + SUPABASE_DB_PASSWORD`);
  }
}

if (!DATABASE_URL) {
  console.error('❌ No database URL found in environment');
  console.log('\nChecked: DATABASE_URL, SUPABASE_DB_URL, POSTGRES_URL, SUPABASE_DATABASE_URL');
  console.log('\nYour .env.local has SUPABASE_URL but needs the database password.');
  console.log('\nRun with your database password:');
  console.log('  SUPABASE_DB_PASSWORD="your-password" node scripts/run-migration.mjs');
  console.log('\nOr get the full connection string from Supabase Dashboard:');
  console.log('  Project Settings → Database → Connection string');
  process.exit(1);
}

const migrationSQL = `
-- Migration: Switch from OpenAI (1536) to Gemini (768) embeddings

-- 1. Drop existing index (required before altering column)
DROP INDEX IF EXISTS idx_knowledge_chunks_embedding;

-- 2. Alter the embedding column dimension
ALTER TABLE public.knowledge_chunks
  ALTER COLUMN embedding TYPE vector(768);

-- 3. Update the similarity search function
CREATE OR REPLACE FUNCTION public.match_knowledge_chunks(
  query_embedding vector(768),
  match_threshold FLOAT DEFAULT 0.75,
  match_count INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  source_id UUID,
  metadata JSONB,
  similarity FLOAT
)
AS $$
  SELECT
    kc.id,
    kc.content,
    kc.source_id,
    kc.metadata,
    1 - (kc.embedding <=> query_embedding) AS similarity
  FROM public.knowledge_chunks kc
  WHERE 1 - (kc.embedding <=> query_embedding) > match_threshold
  ORDER BY kc.embedding <=> query_embedding
  LIMIT match_count;
$$ LANGUAGE SQL IMMUTABLE;

-- 4. Recreate the HNSW index for fast vector search
CREATE INDEX idx_knowledge_chunks_embedding
  ON public.knowledge_chunks USING hnsw (embedding vector_cosine_ops);
`;

async function runMigration() {
  console.log('🔗 Connecting to database...');

  const client = new pg.Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected successfully');

    console.log('🚀 Running migration: Switch to Gemini 768-dim embeddings...');
    await client.query(migrationSQL);

    console.log('✅ Migration completed successfully!');
    console.log('\nChanges applied:');
    console.log('  - Dropped old embedding index');
    console.log('  - Changed embedding column from vector(1536) to vector(768)');
    console.log('  - Updated match_knowledge_chunks function');
    console.log('  - Recreated HNSW index');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
