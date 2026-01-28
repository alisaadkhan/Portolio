import { createClient } from '@supabase/supabase-js';

// 1. Try to load from Vercel Environment
const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 2. Fallback to hardcoded strings (IF env fails, though it shouldn't)
// REPLACE THESE STRINGS BELOW WITH YOUR ACTUAL KEYS AGAIN just to be safe
const supabaseUrl = envUrl || 'https://YOUR_ACTUAL_URL.supabase.co';
const supabaseKey = envKey || 'YOUR_ACTUAL_LONG_KEY_HERE';

export const supabase = createClient(supabaseUrl, supabaseKey);
