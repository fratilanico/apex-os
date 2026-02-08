import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual env loader
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    lines.forEach(line => {
      if (line.trim() && !line.trim().startsWith('#')) {
        const [key, ...value] = line.split('=');
        if (key && value) {
          process.env[key.trim()] = value.join('=').trim().replace(/^["']|["']$/g, '');
        }
      }
    });
  }
}

loadEnv();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase URL or Key is missing. Check .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20260206_rag_entitlement.sql');
  if (!fs.existsSync(migrationPath)) {
    console.error(`Migration file not found at ${migrationPath}`);
    return;
  }
  const sql = fs.readFileSync(migrationPath, 'utf8');
  
  console.log('Applying migration...');
  const { error } = await supabase.rpc('execute_sql', { sql_query: sql });
  
  if (error) {
    console.error('Migration failed:', error.message);
    if (error.message.includes('does not exist')) {
      console.log('RPC "execute_sql" not found. You might need to create it first:');
      console.log(`
        CREATE OR REPLACE FUNCTION execute_sql(sql_query TEXT) RETURNS void AS $$
        BEGIN
          EXECUTE sql_query;
        END;
        $$ LANGUAGE plpgsql;
      `);
    } else {
      console.error('Full error:', JSON.stringify(error, null, 2));
    }
  } else {
    console.log('Migration applied successfully!');
  }
}

applyMigration();
