# Admin Settings Database Integration

This document explains how the Admin Profile & Credentials feature in the Settings page is connected to the Supabase database.

## Overview

The Admin Settings feature allows administrators to:
1. **Update their profile information** (name, email, phone, profile picture)
2. **Change their password** securely through Supabase Auth
3. **Configure security settings** (2FA, login notifications, session timeout, password expiry)

All data is fetched from and saved to the Supabase database in real-time.

## Database Schema

### Profiles Table

The admin profile data is stored in the `profiles` table with the following structure:

```sql
profiles (
  id UUID PRIMARY KEY,              -- Matches auth.users.id
  email TEXT,                        -- Admin email address
  phone TEXT,                        -- Phone number
  display_name TEXT,                 -- Full name (first + last)
  avatar_url TEXT,                   -- Profile picture URL
  role TEXT,                         -- User role (admin/customer)
  security_settings JSONB            -- Security preferences
)
```

### Security Settings Structure

The `security_settings` column is a JSONB object with the following structure:

```json
{
  "twoFactorEnabled": false,
  "loginNotifications": true,
  "sessionTimeout": "30 minutes",
  "passwordExpiry": "90 days"
}
```

## Service Functions

All database operations are handled by the `profileService.js` located in `src/lib/profileService.js`.

### 1. `fetchAdminProfile()`

Fetches the current admin's profile data from the database.

**Returns:**
```javascript
{
  id: "uuid",
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "+1234567890",
  profilePicture: "https://supabase.co/storage/v1/object/public/avatars/...",
  role: "admin"
}
```

**Implementation:**
- Gets the current authenticated user from Supabase Auth
- Queries the `profiles` table for the user's data
- Splits `display_name` into `firstName` and `lastName`
- Returns the `avatar_url` from Supabase Storage

### 2. `uploadProfilePicture(file)`

Uploads a profile picture to Supabase Storage and returns the public URL.

**Parameters:**
- `file` (File): The image file to upload

**Returns:**
- `publicUrl` (string): Public URL of the uploaded image

**Implementation:**
- Validates user is authenticated
- Generates unique filename using user ID and timestamp
- Uploads file to the `avatars` storage bucket
- Returns the public URL for the uploaded file
- Handles upload errors with descriptive messages

### 3. `deleteProfilePicture(avatarUrl)`

Deletes a profile picture from Supabase Storage.

**Parameters:**
- `avatarUrl` (string): The URL of the image to delete

**Implementation:**
- Extracts filename from the URL
- Deletes the file from the `avatars` bucket
- Gracefully handles errors (logs but doesn't throw)

### 4. `updateAdminProfile(profileData)`

Updates the admin's profile in the database.

**Parameters:**
```javascript
{
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  phone: "+1234567890",
  profilePicture: "https://supabase.co/storage/v1/object/public/avatars/..."
}
```

**Implementation:**
- Combines `firstName` and `lastName` into `display_name`
- Updates the `profiles` table with new data
- Stores the Supabase Storage URL in `avatar_url`
- If email changed, updates the Supabase Auth email

### 5. `updateAdminPassword(newPassword)`

Updates the admin's password through Supabase Auth.

**Parameters:**
- `newPassword` (string): The new password

**Implementation:**
- Uses `supabase.auth.updateUser()` to change password
- Password is validated on the client side before submission
- Supabase handles password hashing and security

### 6. `fetchSecuritySettings()`

Fetches security settings from the database.

**Returns:**
```javascript
{
  twoFactorEnabled: false,
  loginNotifications: true,
  sessionTimeout: "30 minutes",
  passwordExpiry: "90 days"
}
```

**Implementation:**
- Queries the `security_settings` column from `profiles` table
- Returns default values if no settings exist

### 7. `updateSecuritySettings(settings)`

Saves security settings to the database.

**Parameters:**
```javascript
{
  twoFactorEnabled: boolean,
  loginNotifications: boolean,
  sessionTimeout: string,
  passwordExpiry: string
}
```

**Implementation:**
- Updates the `security_settings` JSONB column in the `profiles` table

## Component Architecture

### Main Component: `SettingsAdmin.jsx`

Located at: `src/components/Settings/SettingsAdmin.jsx`

**Key Features:**
- Loads profile and security data on mount using `useEffect`
- Shows loading screen while fetching data
- Manages all state for profile, credentials, and passwords
- Handles validation before saving
- Shows success/error modals for user feedback
- Disables buttons during save operations

**State Management:**
```javascript
const [profileData, setProfileData] = useState()      // Profile information
const [credentialsData, setCredentialsData] = useState()  // Security settings
const [passwords, setPasswords] = useState()          // Password fields
const [isLoading, setIsLoading] = useState(true)      // Initial load state
const [isSaving, setIsSaving] = useState(false)       // Save operation state
```

### Child Components

1. **SA_AdminProfile** - Profile information card
2. **SA_ChangePass** - Password change card
3. **SA_SecuritySettings** - Security settings card

All child components:
- Receive data and handlers as props
- Display loading states during save operations
- Show disabled state when appropriate

## Features

### 1. Profile Management

- **Edit Mode Toggle**: Lock/unlock profile editing
- **Profile Picture Upload**: 
  - Supports image files up to 5MB
  - Uploads to Supabase Storage (`avatars` bucket)
  - Stores public URL in `avatar_url` column
  - Shows initials when no picture is set
  - Automatically deletes old picture when uploading new one
  - Shows "Uploading..." status during upload
- **Profile Picture Removal**:
  - Deletes file from Supabase Storage
  - Updates database to remove URL
  - Confirmation dialog before deletion
- **Field Validation**:
  - Email format validation
  - Phone number format validation
  - Required field checking
- **Unsaved Changes Warning**: Prompts before discarding changes

### 2. Password Management

- **Password Strength Validation**:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character
- **Password Visibility Toggle**: Show/hide password fields
- **Confirmation Check**: Ensures new password matches confirmation
- **Current Password Check**: Prevents setting same password

### 3. Security Settings

- **Two-Factor Authentication**: Toggle 2FA (stored in DB)
- **Login Notifications**: Email alerts for new logins
- **Session Timeout**: Configure auto-logout time
  - Options: 15 min, 30 min, 1 hour, 2 hours, 8 hours
- **Password Expiry**: Set password rotation period
  - Options: 30 days, 60 days, 90 days, 180 days, 1 year

## Error Handling

All service functions include comprehensive error handling:

1. **Network Errors**: Caught and displayed to user
2. **Authentication Errors**: User is informed if not authenticated
3. **Database Errors**: Logged to console and shown in modal
4. **Validation Errors**: Prevented before database call

## Data Flow

### Loading Data (On Component Mount)

```
Component Mount
    ↓
useEffect triggered
    ↓
fetchAdminProfile() → Get user from Auth → Query profiles table
    ↓
fetchSecuritySettings() → Query security_settings column
    ↓
Update component state
    ↓
Hide loading screen
```

### Saving Profile

```
User clicks "Save Profile"
    ↓
Validate fields (email, phone, required)
    ↓
updateAdminProfile(data)
    ↓
Update profiles table
    ↓
If email changed → Update auth email
    ↓
Show success modal
    ↓
Update state with new data
```

### Changing Password

```
User clicks "Update Password"
    ↓
Validate password strength
    ↓
Check passwords match
    ↓
Show confirmation modal
    ↓
updateAdminPassword(newPassword)
    ↓
Supabase Auth updates password
    ↓
Show success modal
    ↓
Clear password fields
```

### Saving Security Settings

```
User clicks "Save Security Settings"
    ↓
Check for changes
    ↓
Show confirmation modal
    ↓
updateSecuritySettings(settings)
    ↓
Update security_settings JSONB column
    ↓
Show success modal
    ↓
Update original state
```

## Loading States

The component implements two types of loading states:

1. **Initial Loading** (`isLoading`):
   - Shows `LoadingScreen` component
   - Active when fetching data on mount
   - Hides entire component until data is ready

2. **Saving State** (`isSaving`):
   - Disables all save buttons
   - Shows "Saving..." or "Updating..." text
   - Prevents multiple simultaneous saves

## Security Considerations

1. **Password Security**:
   - Passwords are never fetched or displayed
   - Password updates go through Supabase Auth
   - Supabase handles hashing and encryption

2. **Email Updates**:
   - Changing email updates both `profiles` table and Supabase Auth
   - User may need to verify new email (Supabase feature)

3. **Profile Picture Storage**:
   - Stored in Supabase Storage `avatars` bucket
   - Public URLs stored in `avatar_url` column
   - Old pictures automatically deleted when uploading new ones
   - File size limited to 5MB

## Storage Configuration

### Supabase Storage Setup

The profile picture feature uses Supabase Storage with the `avatars` bucket.

#### Creating the Avatars Bucket

1. Go to Supabase Dashboard → Storage
2. Create a new bucket named `avatars`
3. Set the bucket to **Public** (so profile pictures are publicly accessible)
4. Configure storage policies:

```sql
-- Allow authenticated users to upload avatars
CREATE POLICY "Users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

-- Allow authenticated users to update avatars
CREATE POLICY "Users can update avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars');

-- Allow authenticated users to delete avatars
CREATE POLICY "Users can delete avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars');

-- Allow public read access to all avatars
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

**Note:** The current implementation stores files directly in the bucket root using `{user_id}_{timestamp}.{extension}` naming pattern.

## Future Enhancements

1. **Image Optimization**: 
   - Implement client-side image compression before upload
   - Generate multiple sizes (thumbnail, medium, large)
   - Use WebP format for better compression

2. **Two-Factor Authentication**:
   - Implement actual 2FA using Supabase Auth
   - Add TOTP or SMS verification

3. **Email Verification**:
   - Require email verification on change
   - Send confirmation emails

4. **Session Management**:
   - Implement actual session timeout functionality
   - Auto-logout based on configured timeout

5. **Password Expiry**:
   - Track password change date
   - Prompt user when password expires

6. **Audit Log**:
   - Track all profile and security changes
   - Show change history to admin

7. **Password History**:
   - Prevent reusing recent passwords
   - Store hashed password history

## Testing

To test the database integration:

1. **Profile Update**:
   - Change name, email, phone
   - Upload profile picture
   - Verify changes persist after page reload

2. **Password Change**:
   - Update password
   - Log out and log back in with new password
   - Verify old password no longer works

3. **Security Settings**:
   - Toggle 2FA and notifications
   - Change session timeout and password expiry
   - Verify settings persist after page reload

## Database Permissions

Ensure the following Row Level Security (RLS) policies are set:

```sql
-- Users can read their own profile
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);
```

## Troubleshooting

### Profile Not Loading
- Check browser console for errors
- Verify user is authenticated
- Check Supabase RLS policies
- Ensure profile exists in `profiles` table

### Password Update Fails
- Check password meets strength requirements
- Verify network connection
- Check Supabase Auth configuration
- Look for errors in browser console

### Security Settings Not Saving
- Verify `security_settings` column exists and is JSONB type
- Check RLS policies allow updates
- Ensure user is authenticated
- Check browser console for errors

## Notes

- All database operations include proper error handling
- Loading states provide good UX during async operations
- Modals give clear feedback for all operations
- Validation happens before database calls to reduce errors
- Console logs help with debugging (can be removed in production)

