-- Migration: Setup Avatars Storage Bucket and Policies
-- Purpose: Configure Supabase Storage for admin profile pictures
-- Date: 2025-10-10

-- Note: The bucket must be created manually in the Supabase Dashboard
-- This script only sets up the Row Level Security policies for the bucket

-- Drop existing policies if they exist (for re-running the script)
DROP POLICY IF EXISTS "Users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete avatars" ON storage.objects;

-- Allow ALL authenticated users to upload files to avatars bucket
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
);

-- Allow ALL authenticated users to update files in avatars bucket  
CREATE POLICY "Authenticated users can update avatars"
ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars');

-- Allow ALL authenticated users to delete files in avatars bucket
CREATE POLICY "Authenticated users can delete avatars"
ON storage.objects FOR DELETE
USING (bucket_id = 'avatars');

-- Allow public read access to all avatars (so they display on the site)
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Verify the policies were created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%avatars%'
ORDER BY policyname;

-- Instructions for creating the bucket:
-- 1. Go to Supabase Dashboard → Storage
-- 2. Click "New Bucket"
-- 3. Name: avatars
-- 4. Public: YES (check the public checkbox)
-- 5. Click "Create"
-- 6. Then run this SQL script to set up the policies

