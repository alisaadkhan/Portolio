-- ============================================
-- SUPABASE REALTIME & RLS SETUP
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. ENABLE REALTIME FOR ALL TABLES
-- This allows the frontend to subscribe to database changes
ALTER PUBLICATION supabase_realtime ADD TABLE projects;
ALTER PUBLICATION supabase_realtime ADD TABLE skills;
ALTER PUBLICATION supabase_realtime ADD TABLE certifications;
ALTER PUBLICATION supabase_realtime ADD TABLE profile;

-- 2. ENABLE ROW LEVEL SECURITY (RLS)
-- This is required for security even though we're making tables publicly readable
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;

-- 3. CREATE POLICIES FOR PUBLIC READ ACCESS
-- Allow anyone to read data (for the public website)
CREATE POLICY "Enable read access for all users" ON projects
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON skills
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON certifications
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON profile
    FOR SELECT USING (true);

-- 4. CREATE POLICIES FOR AUTHENTICATED WRITE ACCESS
-- Only authenticated users (admin) can insert/update/delete

-- PROJECTS
CREATE POLICY "Enable insert for authenticated users" ON projects
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON projects
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON projects
    FOR DELETE TO authenticated USING (true);

-- SKILLS
CREATE POLICY "Enable insert for authenticated users" ON skills
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON skills
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON skills
    FOR DELETE TO authenticated USING (true);

-- CERTIFICATIONS
CREATE POLICY "Enable insert for authenticated users" ON certifications
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON certifications
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON certifications
    FOR DELETE TO authenticated USING (true);

-- PROFILE
CREATE POLICY "Enable insert for authenticated users" ON profile
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON profile
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON profile
    FOR DELETE TO authenticated USING (true);

-- ============================================
-- VERIFICATION QUERIES
-- Run these to verify setup is correct
-- ============================================

-- Check if realtime is enabled
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';

-- Check RLS policies
SELECT tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('projects', 'skills', 'certifications', 'profile');
