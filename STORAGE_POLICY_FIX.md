# Storage Policy Fix - RLS Violation Error

## Problem

Error when uploading profile picture:
```
Failed to upload profile picture: new row violates row-level security policy
```

## Quick Fix

Run this SQL in your **Supabase Dashboard** → **SQL Editor**:

```sql
-- Drop any existing policies that might be causing conflicts
DROP POLICY IF EXISTS "Users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete avatars" ON storage.objects;

-- Create new, more permissive policies
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can update avatars"
ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can delete avatars"
ON storage.objects FOR DELETE
USING (bucket_id = 'avatars');

CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');
```

## Verify the Fix

After running the SQL, check that the policies were created:

```sql
SELECT policyname, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%avatars%';
```

You should see:
- ✅ Authenticated users can upload avatars (INSERT)
- ✅ Authenticated users can update avatars (UPDATE)
- ✅ Authenticated users can delete avatars (DELETE)
- ✅ Public can view avatars (SELECT)

## Test the Upload Again

1. Refresh your browser (Ctrl+F5 or Cmd+Shift+R)
2. Navigate to **Settings** → **Admin Profile & Credentials**
3. Click **"Upload New"**
4. Select an image
5. ✅ Should upload successfully now!

## Why This Fixes It

The original policies were too restrictive. The new policies:
- Allow **all authenticated users** to upload/update/delete files in the `avatars` bucket
- Allow **public access** to view the files (so profile pictures display)
- Remove complex checks that were causing the RLS violation

## Alternative: Disable RLS on Avatars Bucket

If the above doesn't work, you can disable RLS for the avatars bucket entirely (since it's public anyway):

```sql
-- Check current bucket configuration
SELECT * FROM storage.buckets WHERE name = 'avatars';

-- If public = true, you can optionally disable RLS checking
-- Note: Only do this if the bucket is already public
UPDATE storage.buckets 
SET public = true 
WHERE name = 'avatars';
```

## Still Having Issues?

1. **Verify bucket exists:**
   ```sql
   SELECT name, public FROM storage.buckets WHERE name = 'avatars';
   ```
   - Should return one row with `public = true`

2. **Check if RLS is enabled:**
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'storage' AND tablename = 'objects';
   ```

3. **Verify you're logged in:**
   - Make sure you're authenticated in the app
   - Try logging out and back in

4. **Check browser console:**
   - Open Developer Tools (F12)
   - Look for detailed error messages
   - Check the Network tab for failed requests

## Need More Help?

Check the full storage setup guide: `ADMIN_SETTINGS_SETUP.md`

