import { createClient } from '@supabase/supabase-js';

// 1. I took this from your screenshot:
const supabaseUrl = 'https://qijvkldsmzxerisjvcnr.supabase.co';

// 2. PASTE THE LONG 'anon' KEY FROM THE DASHBOARD HERE:
const supabaseKey = 'PASTE_YOUR_KEY_HERE';

export const supabase = createClient(supabaseUrl, supabaseKey);
