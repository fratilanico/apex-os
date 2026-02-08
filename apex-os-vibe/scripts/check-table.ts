
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Environment variables missing');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
  try {
    const { data, error } = await supabase.from('foundry_tasks').select('*').limit(1);
    if (error) {
      console.log('Table error:', error.message);
    } else {
      console.log('Table exists, data:', data);
    }
    
    const { data: versions, error: vError } = await supabase.from('app_versions').select('*').limit(1);
    if (vError) {
      console.log('Versions table error:', vError.message);
    } else {
      console.log('Versions table exists');
    }
  } catch (e: any) {
    console.error('Check failed:', e.message);
  }
}

check();
