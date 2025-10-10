# Database Migrations

This folder contains SQL migration scripts for the NUeats Canteen database.

## How to Run Migrations

### Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the **SQL Editor** section
3. Click **New Query**
4. Copy the contents of the migration file
5. Paste into the SQL editor
6. Click **Run** to execute the migration

### Using Supabase CLI

```bash
# Make sure you're in the project directory
cd /path/to/NUeats-Canteen

# Run a specific migration
supabase db execute < migrations/add_security_settings_to_profiles.sql
```

## Available Migrations

### 1. `setup_avatars_storage.sql`

**Purpose:** Configures Supabase Storage policies for the `avatars` bucket.

**What it does:**
- Sets up Row Level Security policies for the avatars bucket
- Allows authenticated users to upload, update, and delete avatars
- Allows public read access so profile pictures display correctly
- Includes safety checks to drop existing policies before recreating

**Prerequisites:**
- The `avatars` bucket must be created manually in Supabase Dashboard first
- Set the bucket to **Public**

**When to run:** Before using the profile picture upload feature.

**Manual Steps Required:**
1. Go to Supabase Dashboard → Storage
2. Click "New Bucket"
3. Name: `avatars`
4. Public: **YES** (check the public checkbox)
5. Click "Create"
6. Then run this migration

### 2. `add_security_settings_to_profiles.sql`

**Purpose:** Adds the `security_settings` column to the `profiles` table for storing admin security preferences.

**What it does:**
- Adds a new JSONB column `security_settings` to the `profiles` table
- Sets default values for existing admin profiles
- Creates a GIN index for faster queries
- Includes safety checks to prevent errors if column already exists

**Default Security Settings:**
```json
{
  "twoFactorEnabled": false,
  "loginNotifications": true,
  "sessionTimeout": "30 minutes",
  "passwordExpiry": "90 days"
}
```

**When to run:** Before using the Admin Settings feature in the Settings page.

### 3. `create_store_settings_table.sql`

**Purpose:** Creates the `store_settings` table for canteen/store configuration.

**What it does:**
- Creates `store_settings` table with canteen info, hours, and payment methods
- Sets up RLS policies (anyone can read, only admins can modify)
- Creates trigger for `updated_at` timestamp
- Inserts default store settings record

**Table Structure:**
- Canteen information (name, description, contact, address)
- Operating hours (JSONB - daily schedule)
- Payment methods (JSONB - enabled payment options)

**When to run:** Before using the Store Settings feature in the Settings page.

## Migration Best Practices

1. **Always backup your database** before running migrations in production
2. **Test migrations** in a development environment first
3. **Review the SQL** before executing to understand what changes will be made
4. **Run migrations in order** if there are dependencies between them
5. **Keep migrations idempotent** - they should be safe to run multiple times

## Migration Order

Run migrations in this order for a fresh setup:

1. `setup_avatars_storage.sql` - Storage policies for profile pictures
2. `add_security_settings_to_profiles.sql` - Security settings column
3. `create_store_settings_table.sql` - Store settings table

## Rollback

If you need to rollback a migration, you can manually remove the changes:

### Rollback `setup_avatars_storage.sql`

```sql
-- Remove storage policies
DROP POLICY IF EXISTS "Users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;

-- Then manually delete the avatars bucket from Supabase Dashboard
```

### Rollback `add_security_settings_to_profiles.sql`

```sql
-- Remove the security_settings column
ALTER TABLE profiles DROP COLUMN IF EXISTS security_settings;

-- Remove the index
DROP INDEX IF EXISTS idx_profiles_security_settings;
```

### Rollback `create_store_settings_table.sql`

```sql
-- Drop the table and all policies
DROP TABLE IF EXISTS store_settings CASCADE;

-- Drop the trigger function if no longer needed
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
```

## Notes

- All migrations include safety checks (IF NOT EXISTS, etc.)
- Migrations are designed to be idempotent when possible
- Each migration includes comments explaining its purpose
- Verify migrations after running by checking the verification query at the end

