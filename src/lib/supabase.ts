import { createClient } from '@supabase/supabase-js';

// 1. I took this from your screenshot:
const supabaseUrl = 'https://qijvkldsmzxerisjvcnr.supabase.co';

// 2. PASTE THE LONG 'anon' KEY FROM THE DASHBOARD HERE:
// This key looks incorrect - it should start with 'eyJ...'
// Get the correct key from: Supabase Dashboard > Settings > API > anon/public key
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpanZrbGRzbXp4ZXJpc2p2Y25yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1MzgzMTAsImV4cCI6MjA1NDExNDMxMH0.placeholder';

export const supabase = createClient(supabaseUrl, supabaseKey);
