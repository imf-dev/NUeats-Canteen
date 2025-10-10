# Admin Settings Setup Guide

This guide will help you set up and use the Admin Settings database integration.

## Quick Start

### Step 1: Create the Avatars Storage Bucket

1. Go to your Supabase project dashboard
2. Navigate to **Storage**
3. Click **New Bucket**
4. Name it `avatars`
5. Make it **Public** (check the public checkbox)
6. Click **Create**

Then set up the storage policies in SQL Editor:

```sql
-- Drop any existing conflicting policies
DROP POLICY IF EXISTS "Users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete avatars" ON storage.objects;

-- Create new policies
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

### Step 2: Run the Database Migration

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `migrations/add_security_settings_to_profiles.sql`
5. Click **Run** to execute the migration

This will add the `security_settings` column to your `profiles` table.

### Step 3: Verify Your Profile Exists

Make sure you have a profile in the `profiles` table:

```sql
-- Check if your profile exists
SELECT * FROM profiles WHERE id = auth.uid();
```

If you don't have a profile, create one:

```sql
-- Create a profile for the current user
INSERT INTO profiles (id, email, role, display_name)
VALUES (
  auth.uid(),
  'your-email@example.com',
  'admin',
  'Your Full Name'
);
```

Or run the sync script:

```bash
npm run profiles:sync
```

### Step 4: Test the Feature

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Log in to the admin portal

3. Navigate to **Settings** → **Admin Profile & Credentials**

4. Try the following features:
   - **Update Profile**: Change your name, email, or phone
   - **Upload Picture**: Add a profile picture
   - **Change Password**: Update your password
   - **Security Settings**: Toggle 2FA, notifications, etc.

## Features Overview

### 1. Admin Profile
- Edit personal information (name, email, phone)
- Upload profile pictures to Supabase Storage
- Remove profile pictures (deletes from storage)
- Lock/unlock editing with toggle button
- Real-time validation of email and phone formats
- Pictures stored in `avatars` bucket with public URLs

### 2. Change Password
- Strong password validation
- Password visibility toggle
- Secure updates through Supabase Auth

### 3. Security Settings
- Two-Factor Authentication toggle
- Login notification preferences
- Session timeout configuration
- Password expiry settings

## Troubleshooting

### Profile Not Loading

**Problem:** Settings page shows loading screen indefinitely

**Solution:**
1. Check browser console for errors
2. Verify you're logged in as an admin
3. Ensure your profile exists in the database:
   ```sql
   SELECT * FROM profiles WHERE id = auth.uid();
   ```
4. Check RLS policies allow reading your profile

### Can't Update Profile

**Problem:** "Failed to update profile" error

**Solution:**
1. Check browser console for detailed error
2. Verify RLS policies:
   ```sql
   -- Should allow users to update their own profile
   CREATE POLICY "Users can update own profile" 
     ON profiles FOR UPDATE 
     USING (auth.uid() = id);
   ```
3. Ensure email format is valid
4. Ensure phone number format is valid

### Password Update Fails

**Problem:** Password change doesn't work

**Solution:**
1. Ensure password meets requirements:
   - At least 8 characters
   - One uppercase letter
   - One lowercase letter
   - One number
   - One special character
2. Ensure new password is different from current
3. Check Supabase Auth is configured correctly

### Security Settings Not Saving

**Problem:** Security settings reset after page reload

**Solution:**
1. Run the migration to add `security_settings` column
2. Check column exists:
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns
   WHERE table_name = 'profiles' 
   AND column_name = 'security_settings';
   ```
3. Verify RLS policies allow updates

## Database Schema

### Profiles Table

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  phone TEXT,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT,
  security_settings JSONB DEFAULT '{
    "twoFactorEnabled": false,
    "loginNotifications": true,
    "sessionTimeout": "30 minutes",
    "passwordExpiry": "90 days"
  }'::jsonb
);
```

### Required RLS Policies

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);
```

## Advanced Configuration

### Profile Picture Storage

Profile pictures are stored in Supabase Storage:

1. **Bucket:** `avatars` (public)
2. **Filename Pattern:** `{user_id}_{timestamp}.{extension}`
3. **URL Storage:** Public URLs stored in `profiles.avatar_url`
4. **File Size Limit:** 5MB maximum
5. **Supported Formats:** All image types (JPG, PNG, GIF, WebP, etc.)

**How it works:**
- User selects an image
- Old picture is deleted from storage (if exists)
- New picture is uploaded to Supabase Storage
- Public URL is saved to database
- Picture displays immediately using the URL

### Email Verification

To require email verification when changing email:

1. Enable email verification in Supabase Auth settings
2. Users will receive a confirmation email when changing email
3. Email change won't take effect until verified

### Two-Factor Authentication

To implement actual 2FA:

1. Enable TOTP in Supabase Auth settings
2. Update the toggle handler to enable/disable TOTP
3. Add QR code display for TOTP setup

## API Reference

See [ADMIN_SETTINGS_DATABASE_INTEGRATION.md](ADMIN_SETTINGS_DATABASE_INTEGRATION.md) for detailed API documentation.

## Need Help?

1. Check the browser console for errors
2. Review the detailed documentation in `ADMIN_SETTINGS_DATABASE_INTEGRATION.md`
3. Verify database migrations were run correctly
4. Check Supabase RLS policies are configured properly

