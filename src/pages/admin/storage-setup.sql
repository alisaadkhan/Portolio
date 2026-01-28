-- =====================================================
-- SUPABASE STORAGE SETUP FOR IMAGE UPLOADS
-- =====================================================

-- 1. CREATE STORAGE BUCKET
-- Run this in Supabase SQL Editor

-- Create the 'portfolio' bucket for storing images
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true);

-- 2. SET STORAGE POLICIES
-- Allow public read access
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'portfolio' );

-- Allow authenticated users to upload
create policy "Authenticated users can upload"
on storage.objects for insert
with check ( bucket_id = 'portfolio' AND auth.role() = 'authenticated' );

-- Allow authenticated users to update their uploads
create policy "Authenticated users can update"
on storage.objects for update
using ( bucket_id = 'portfolio' AND auth.role() = 'authenticated' );

-- Allow authenticated users to delete
create policy "Authenticated users can delete"
on storage.objects for delete
using ( bucket_id = 'portfolio' AND auth.role() = 'authenticated' );

-- =====================================================
-- FOLDER STRUCTURE
-- =====================================================
-- The upload component will automatically create folders:
-- - portfolio/profile/      (Avatar & Hero images)
-- - portfolio/projects/     (Project thumbnails)
-- - portfolio/certifications/ (Certificate images)
-- - portfolio/skills/       (Skill icons if needed)

-- =====================================================
-- VERIFICATION
-- =====================================================
-- After running this script:
-- 1. Go to Supabase Dashboard → Storage
-- 2. You should see 'portfolio' bucket
-- 3. Test upload from Admin Panel
-- 4. Images should appear in the bucket with public URLs

-- =====================================================
-- FILE SIZE & TYPE LIMITS
-- =====================================================
-- Default Supabase limits:
-- - Max file size: 50MB
-- - Accepted types: All (filter in frontend: image/*)
-- 
-- Frontend validation (already implemented):
-- - Max file size: 5MB
-- - Types: image/* (PNG, JPG, WEBP, etc.)

-- =====================================================
-- PUBLIC URL FORMAT
-- =====================================================
-- https://<project-ref>.supabase.co/storage/v1/object/public/portfolio/<folder>/<filename>
-- Example:
-- https://qijvkldsmzxerisjvcnr.supabase.co/storage/v1/object/public/portfolio/projects/1738105234-abc123.jpg
