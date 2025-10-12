# Store Settings Setup Guide

This guide will help you set up and use the Store Settings database integration.

## Quick Start

### Step 1: Run the Database Migration

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the contents of `migrations/create_store_settings_table.sql`
5. Click **Run** to execute the migration

This will:
- ✅ Create the `store_settings` table
- ✅ Set up RLS policies
- ✅ Create triggers for `updated_at`
- ✅ Insert default store settings

### Step 2: Verify the Setup

Check that the table was created successfully:

```sql
-- Check table structure
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_name = 'store_settings'
ORDER BY ordinal_position;

-- Check default record
SELECT * FROM store_settings LIMIT 1;
```

You should see one record with default values:
- Name: NU EATS
- Description: A modern canteen...
- Default operating hours
- Default payment methods

### Step 3: Test the Feature

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Log in to the admin portal

3. Navigate to **Settings** → **Store Settings**

4. Try the following features:
   - **Canteen Information**: Update name, description, contact details
   - **Operating Hours**: Change daily schedule
   - **Payment Methods**: Toggle payment options

## Features Overview

### 1. Canteen Information

Configure basic canteen details:

- **App/Canteen Name** - Display name for your canteen
- **Description** - Brief description of your canteen
- **Phone Number** - Contact phone number
- **Email Address** - Contact email
- **Street Address** - Physical address
- **City** - City location
- **Province** - Province/State
- **ZIP Code** - Postal code

**How to use:**
1. Click the "Edit" toggle to enable editing
2. Modify any fields
3. Click "Save Canteen Info"
4. Changes are saved to database

### 2. Operating Hours

Set daily operating schedule:

- **Toggle Open/Closed** - Enable/disable specific days
- **Set Times** - Choose opening and closing hours
- **Visual Status** - See "Open" or "Closed" for each day

**Time Options:** 8:00 AM - 5:00 PM

**How to use:**
1. Toggle any day on/off
2. Select opening and closing times
3. Click "Save Operating Hours"
4. Schedule is saved to database

### 3. Payment Methods

Enable/disable payment options:

- ☑️ Cash Payment
- ☑️ PayMongo
- ☑️ Credit/Debit Card

**How to use:**
1. Check/uncheck payment methods
2. Click "Save Payment Methods"
3. Settings are saved to database

## Database Structure

### store_settings Table

```sql
-- Canteen Information Fields
name TEXT
description TEXT
phone_number TEXT
email_address TEXT
street_address TEXT
city TEXT
province TEXT
zip_code TEXT

-- Operating Hours (JSONB)
operating_hours JSONB

-- Payment Methods (JSONB)
payment_methods JSONB
```

### Operating Hours Format

```json
{
  "monday": {
    "open": true,
    "openTime": "08:00",
    "closeTime": "17:00"
  },
  // ... for each day
}
```

### Payment Methods Format

```json
{
  "cashPayment": true,
  "payMongo": false,
  "creditDebitCard": false
}
```

## Troubleshooting

### Settings Not Loading

**Problem:** Store Settings page shows loading indefinitely

**Solutions:**
1. Check browser console for errors
2. Verify `store_settings` table exists:
   ```sql
   SELECT * FROM store_settings;
   ```
3. Ensure at least one record exists
4. Check RLS policies allow reading

### Can't Update Settings

**Problem:** Save button doesn't work or shows error

**Solutions:**
1. Verify you're logged in as admin
2. Check your role in profiles table:
   ```sql
   SELECT role FROM profiles WHERE id = auth.uid();
   ```
3. Ensure RLS policies allow updates:
   ```sql
   SELECT * FROM pg_policies 
   WHERE tablename = 'store_settings';
   ```
4. Check browser console for detailed errors

### Changes Don't Persist

**Problem:** Settings reset after page reload

**Solutions:**
1. Verify save operation succeeded (check for success modal)
2. Check database directly:
   ```sql
   SELECT * FROM store_settings;
   ```
3. Look for errors in browser console
4. Ensure no network issues

### Default Values Wrong

**Problem:** Default settings are incorrect

**Solution:** Update the default record:
```sql
UPDATE store_settings SET
  name = 'Your Canteen Name',
  description = 'Your description',
  phone_number = 'Your phone',
  email_address = 'your@email.com'
WHERE id = (SELECT id FROM store_settings LIMIT 1);
```

## Security

### Row Level Security Policies

The table has these RLS policies:

1. **Public Read Access:**
   ```sql
   CREATE POLICY "Anyone can view store settings"
     ON store_settings FOR SELECT
     USING (true);
   ```
   - Anyone can view store settings
   - Needed for displaying canteen info to customers

2. **Admin Update Access:**
   ```sql
   CREATE POLICY "Admins can update store settings"
     ON store_settings FOR UPDATE
     USING (
       EXISTS (
         SELECT 1 FROM profiles 
         WHERE id = auth.uid() 
         AND role = 'admin'
       )
     );
   ```
   - Only admins can update settings
   - Verified through profiles table role

3. **Admin Insert Access:**
   - Only admins can create new settings records
   - Same role check as updates

## Advanced Configuration

### Multiple Store Locations

To support multiple locations, modify the table:

```sql
-- Add location field
ALTER TABLE store_settings 
ADD COLUMN location_id UUID;

-- Update RLS policies to filter by location
-- ... policy updates
```

### Custom Time Ranges

To add custom time ranges:

1. Modify the dropdown options in `SS_OperatingHours.jsx`
2. Update `generateTimeOptions()` function
3. Add more time slots as needed

### Holiday Schedule

To add holiday hours:

```sql
-- Add holidays field
ALTER TABLE store_settings 
ADD COLUMN holiday_hours JSONB;

-- Store holiday-specific hours
UPDATE store_settings SET 
holiday_hours = '{
  "2024-12-25": {"open": false},
  "2024-12-31": {"open": true, "openTime": "08:00", "closeTime": "15:00"}
}'
```

## API Reference

See [STORE_SETTINGS_DATABASE_INTEGRATION.md](STORE_SETTINGS_DATABASE_INTEGRATION.md) for detailed API documentation.

## Testing Checklist

- [ ] Migration runs without errors
- [ ] Default record is created
- [ ] Settings page loads successfully
- [ ] Canteen info can be updated
- [ ] Operating hours can be modified
- [ ] Payment methods can be toggled
- [ ] Changes persist after page reload
- [ ] Non-admin users cannot modify settings
- [ ] Success/error modals display correctly
- [ ] Loading states work properly

## Need Help?

1. Check the browser console for errors
2. Review the detailed documentation in `STORE_SETTINGS_DATABASE_INTEGRATION.md`
3. Verify all migrations were run correctly
4. Check Supabase RLS policies are configured properly

