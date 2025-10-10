-- Migration: Add security_settings column to profiles table
-- Purpose: Store admin security preferences (2FA, notifications, session timeout, etc.)
-- Date: 2025-10-10

-- Add security_settings column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'security_settings'
    ) THEN
        ALTER TABLE profiles 
        ADD COLUMN security_settings JSONB DEFAULT '{
            "twoFactorEnabled": false,
            "loginNotifications": true,
            "sessionTimeout": "30 minutes",
            "passwordExpiry": "90 days"
        }'::jsonb;
        
        COMMENT ON COLUMN profiles.security_settings IS 'Security preferences for admin users';
    END IF;
END $$;

-- Update existing admin profiles with default security settings if NULL
UPDATE profiles 
SET security_settings = '{
    "twoFactorEnabled": false,
    "loginNotifications": true,
    "sessionTimeout": "30 minutes",
    "passwordExpiry": "90 days"
}'::jsonb
WHERE security_settings IS NULL 
AND role = 'admin';

-- Optional: Create an index for faster queries on security settings
CREATE INDEX IF NOT EXISTS idx_profiles_security_settings 
ON profiles USING GIN (security_settings);

-- Verify the migration
SELECT 
    column_name, 
    data_type, 
    column_default
FROM information_schema.columns
WHERE table_name = 'profiles' 
AND column_name = 'security_settings';

