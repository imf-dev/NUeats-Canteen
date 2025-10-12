-- Migration: Create store_settings Table
-- Purpose: Store canteen/store settings including info, hours, and payment methods
-- Date: 2025-10-10

-- Create the store_settings table
CREATE TABLE IF NOT EXISTS store_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Canteen Information
  name TEXT NOT NULL DEFAULT 'NU EATS',
  description TEXT,
  phone_number TEXT,
  email_address TEXT,
  street_address TEXT,
  city TEXT,
  province TEXT,
  zip_code TEXT,
  
  -- Operating Hours (stored as JSONB for flexibility)
  operating_hours JSONB DEFAULT '{
    "monday": {"open": true, "openTime": "08:00", "closeTime": "17:00"},
    "tuesday": {"open": true, "openTime": "08:00", "closeTime": "17:00"},
    "wednesday": {"open": true, "openTime": "08:00", "closeTime": "17:00"},
    "thursday": {"open": true, "openTime": "08:00", "closeTime": "17:00"},
    "friday": {"open": true, "openTime": "08:00", "closeTime": "17:00"},
    "saturday": {"open": true, "openTime": "08:00", "closeTime": "17:00"},
    "sunday": {"open": false, "openTime": "08:00", "closeTime": "17:00"}
  }'::jsonb,
  
  -- Payment Methods (stored as JSONB)
  payment_methods JSONB DEFAULT '{
    "cashPayment": true,
    "payMongo": false,
    "creditDebitCard": false
  }'::jsonb,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comment to table
COMMENT ON TABLE store_settings IS 'Stores canteen/store configuration and settings';

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_store_settings_updated_at ON store_settings;
CREATE TRIGGER update_store_settings_updated_at
  BEFORE UPDATE ON store_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read store settings
CREATE POLICY "Anyone can view store settings"
  ON store_settings FOR SELECT
  USING (true);  -- Public read access since it's basic store info

-- Policy: Only admins can update store settings
CREATE POLICY "Admins can update store settings"
  ON store_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Policy: Only admins can insert store settings
CREATE POLICY "Admins can insert store settings"
  ON store_settings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Insert default store settings if none exist
INSERT INTO store_settings (
  name,
  description,
  phone_number,
  email_address,
  street_address,
  city,
  province,
  zip_code
) VALUES (
  'NU EATS',
  'A modern canteen serving fresh, healthy meals with convenient mobile ordering and pickup service.',
  '(+63)912 345 6789',
  'contact@nueats.com',
  'Sampaloc 1 Bridge, SM Dasmarinas, Governor''s Dr',
  'Dasmarinas',
  'Cavite',
  '4114'
)
ON CONFLICT DO NOTHING;

-- Verify the table was created
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'store_settings'
ORDER BY ordinal_position;

-- Verify the default record was created
SELECT * FROM store_settings LIMIT 1;

