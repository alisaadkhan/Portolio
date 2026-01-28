import { createClient } from '@supabase/supabase-js';

// 1. I took this from your screenshot:
const supabaseUrl = 'https://qijvkldsmzxerisjvcnr.supabase.co';

// 2. PASTE THE LONG 'anon' KEY FROM THE DASHBOARD HERE:
const supabaseKey = 'sb_publishable_Az_f0WQ671iRBZAXNANySg_vxHGwlkD';

export const supabase = createClient(supabaseUrl, supabaseKey);
