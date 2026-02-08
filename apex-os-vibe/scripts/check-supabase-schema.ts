import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual env loader
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    lines.forEach(line => {
      const [key, ...value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.join('=').trim().replace(/^["']|["']$/g, '');
      }
    });
  }
}

loadEnv();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function checkSchema() {
  const tables = ['knowledge_chunks', 'user_profiles', 'waitlist'];
  for (const table of tables) {
    console.log(`\n--- Table: ${table} ---`);
    const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
    
    if (error) {
      console.error(`Error reading ${table}:`, error.message);
    } else if (data && data.length > 0) {
      console.log('Columns:', Object.keys(data[0]));
    } else {
      console.log('Table empty or not found');
    }
  }
}

checkSchema();
