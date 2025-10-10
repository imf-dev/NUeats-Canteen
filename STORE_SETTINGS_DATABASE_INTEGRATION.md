# Store Settings Database Integration

This document explains how the Store Settings feature in the Settings page is connected to the Supabase database.

## Overview

The Store Settings feature allows administrators to configure:
1. **Canteen Information** (name, description, contact details, address)
2. **Operating Hours** (daily schedule for each day of the week)
3. **Payment Methods** (accepted payment options)

All data is stored in the `store_settings` table and fetched/updated in real-time.

## Database Schema

### store_settings Table

```sql
CREATE TABLE store_settings (
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
  
  -- Operating Hours (JSONB)
  operating_hours JSONB DEFAULT '{...}',
  
  -- Payment Methods (JSONB)
  payment_methods JSONB DEFAULT '{...}',
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Operating Hours Structure

Stored as JSONB with the following format:

```json
{
  "monday": {
    "open": true,
    "openTime": "08:00",
    "closeTime": "17:00"
  },
  "tuesday": {
    "open": true,
    "openTime": "08:00",
    "closeTime": "17:00"
  },
  // ... for each day of the week
}
```

### Payment Methods Structure

Stored as JSONB:

```json
{
  "cashPayment": true,
  "payMongo": false,
  "creditDebitCard": false
}
```

## Service Functions

All database operations are handled by `storeSettingsService.js` located in `src/lib/storeSettingsService.js`.

### 1. `fetchStoreSettings()`

Fetches the store settings from the database.

**Returns:**
```javascript
{
  id: "uuid",
  canteenInfo: {
    name: "NU EATS",
    description: "A modern canteen...",
    phoneNumber: "(+63)912 345 6789",
    emailAddress: "contact@nueats.com",
    streetAddress: "Sampaloc 1 Bridge...",
    city: "Dasmarinas",
    province: "Cavite",
    zipCode: "4114"
  },
  operatingHours: {
    monday: { open: true, openTime: "08:00", closeTime: "17:00" },
    // ... other days
  },
  paymentMethods: {
    cashPayment: true,
    payMongo: false,
    creditDebitCard: false
  }
}
```

**Implementation:**
- Queries the `store_settings` table
- Returns the first record (should only be one)
- Transforms snake_case database fields to camelCase

### 2. `updateCanteenInfo(settingsId, canteenInfo)`

Updates canteen information in the database.

**Parameters:**
```javascript
{
  name: "NU EATS",
  description: "A modern canteen...",
  phoneNumber: "(+63)912 345 6789",
  emailAddress: "contact@nueats.com",
  streetAddress: "Sampaloc 1 Bridge...",
  city: "Dasmarinas",
  province: "Cavite",
  zipCode: "4114"
}
```

**Implementation:**
- Transforms camelCase to snake_case
- Updates the specified record
- Returns success boolean

### 3. `updateOperatingHours(settingsId, operatingHours)`

Updates operating hours in the database.

**Parameters:**
```javascript
{
  monday: { open: true, openTime: "08:00", closeTime: "17:00" },
  tuesday: { open: false, openTime: "08:00", closeTime: "17:00" },
  // ... other days
}
```

**Implementation:**
- Updates the `operating_hours` JSONB column
- Entire object is replaced

### 4. `updatePaymentMethods(settingsId, paymentMethods)`

Updates payment methods in the database.

**Parameters:**
```javascript
{
  cashPayment: true,
  payMongo: false,
  creditDebitCard: false
}
```

**Implementation:**
- Updates the `payment_methods` JSONB column

### 5. `updateStoreSettings(settingsId, settings)`

Updates all store settings at once (optional utility function).

**Parameters:**
Full settings object with all three sections.

## Component Architecture

### Main Component: `SettingsStore.jsx`

Located at: `src/components/Settings/SettingsStore.jsx`

**Key Features:**
- Loads all settings on component mount
- Shows loading screen while fetching
- Manages state for all three sections
- Validates data before saving
- Shows success/error modals
- Disables buttons during save operations

**State Management:**
```javascript
const [canteenInfo, setCanteenInfo] = useState()       // Canteen details
const [operatingHours, setOperatingHours] = useState() // Daily hours
const [paymentMethods, setPaymentMethods] = useState() // Payment options
const [settingsId, setSettingsId] = useState()         // Record ID
const [isLoading, setIsLoading] = useState(true)       // Initial load
const [isSaving, setIsSaving] = useState(false)        // Save operation
```

### Child Components

1. **SS_CanteenInfo** - Canteen information card
2. **SS_OperatingHours** - Operating hours schedule
3. **SS_PaymentMethod** - Payment methods configuration

All child components:
- Receive data and handlers as props
- Show saving states during operations
- Validate data before triggering save
- Track original data for change detection

## Features

### 1. Canteen Information

- **Edit Mode Toggle**: Lock/unlock editing
- **Required Fields**:
  - Canteen/App Name
  - Description
  - Phone Number
  - Email Address
  - Street Address
  - City
  - Province
  - ZIP Code
- **Validation**: Checks for empty fields before saving
- **Change Detection**: Only saves if data actually changed

### 2. Operating Hours

- **Day-by-Day Configuration**: Set hours for each day independently
- **Open/Closed Toggle**: Easily enable/disable specific days
- **Time Selection**: Dropdown for open and close times (8 AM - 5 PM)
- **Visual Status**: Shows "Open" or "Closed" for each day
- **Automatic Saving**: Detects changes and saves to database

### 3. Payment Methods

- **Three Options**:
  - Cash Payment
  - PayMongo
  - Credit/Debit Card
- **Checkbox Interface**: Simple enable/disable
- **Change Detection**: Only saves when methods actually change

## Error Handling

All service functions include comprehensive error handling:

1. **Network Errors**: Caught and displayed to user
2. **Database Errors**: Logged to console and shown in modal
3. **Validation Errors**: Prevented before database call
4. **Missing Data**: Handled with default values

## Data Flow

### Loading Data (On Component Mount)

```
Component Mount
    ↓
useEffect triggered
    ↓
fetchStoreSettings() → Query store_settings table
    ↓
Transform data (snake_case → camelCase)
    ↓
Update component state
    ↓
Hide loading screen
```

### Saving Canteen Info

```
User clicks "Save Canteen Info"
    ↓
Validate required fields
    ↓
Check for changes
    ↓
updateCanteenInfo(id, data)
    ↓
Transform data (camelCase → snake_case)
    ↓
Update store_settings table
    ↓
Show success modal
```

### Saving Operating Hours

```
User clicks "Save Operating Hours"
    ↓
Check for changes
    ↓
updateOperatingHours(id, hours)
    ↓
Update operating_hours JSONB column
    ↓
Show success modal
```

### Saving Payment Methods

```
User clicks "Save Payment Methods"
    ↓
Check for changes
    ↓
updatePaymentMethods(id, methods)
    ↓
Update payment_methods JSONB column
    ↓
Show success modal
```

## Loading States

The component implements two types of loading states:

1. **Initial Loading** (`isLoading`):
   - Shows `LoadingScreen` component
   - Active when fetching data on mount
   - Hides entire component until data is ready

2. **Saving State** (`isSaving`):
   - Disables all save buttons
   - Shows "Saving..." text
   - Prevents multiple simultaneous saves

## Row Level Security (RLS)

The `store_settings` table has the following RLS policies:

```sql
-- Anyone can view store settings (public info)
CREATE POLICY "Anyone can view store settings"
  ON store_settings FOR SELECT
  USING (true);

-- Only admins can update settings
CREATE POLICY "Admins can update store settings"
  ON store_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Only admins can insert settings
CREATE POLICY "Admins can insert store settings"
  ON store_settings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );
```

## Default Data

The migration automatically creates a default store settings record:

- **Name**: NU EATS
- **Description**: A modern canteen serving fresh, healthy meals...
- **Phone**: (+63)912 345 6789
- **Email**: contact@nueats.com
- **Address**: Sampaloc 1 Bridge, SM Dasmarinas, Governor's Dr
- **City**: Dasmarinas
- **Province**: Cavite
- **ZIP**: 4114
- **Operating Hours**: Monday-Saturday 8 AM - 5 PM, Sunday closed
- **Payment Methods**: Cash only (PayMongo and Card disabled)

## Future Enhancements

1. **Multiple Locations**: Support for multiple canteen locations
2. **Holiday Hours**: Special hours for holidays
3. **Break Times**: Add lunch/break time periods
4. **Auto-Scheduling**: Automatically close on holidays
5. **Payment Integration**: API keys for payment providers
6. **Email Notifications**: Alert on settings changes
7. **Settings History**: Track all changes with timestamps
8. **Custom Time Ranges**: More flexible time selection
9. **Time Zones**: Support for different time zones
10. **Bulk Import/Export**: JSON import/export for settings

## Testing

To test the database integration:

1. **Canteen Info Update**:
   - Change any field
   - Click "Save Canteen Info"
   - Verify success message
   - Reload page → changes persist

2. **Operating Hours Update**:
   - Toggle a day open/closed
   - Change times
   - Click "Save Operating Hours"
   - Verify changes persist

3. **Payment Methods Update**:
   - Toggle payment methods
   - Click "Save Payment Methods"
   - Verify settings persist

## Database Migration

Run `migrations/create_store_settings_table.sql` in Supabase SQL Editor.

This migration:
- Creates the `store_settings` table
- Sets up RLS policies
- Creates triggers for `updated_at`
- Inserts default settings record

## Troubleshooting

### Settings Not Loading
- Check browser console for errors
- Verify `store_settings` table exists
- Ensure at least one record exists
- Check RLS policies allow reading

### Can't Update Settings
- Verify user is logged in as admin
- Check user's role in `profiles` table
- Ensure RLS policies allow updates for admins
- Check browser console for errors

### Changes Don't Persist
- Verify save operation completes successfully
- Check for errors in browser console
- Ensure `updated_at` trigger is working
- Verify database connection

## Notes

- Single record architecture (only one store settings record)
- JSONB used for flexible nested data structures
- All save operations show immediate feedback
- Loading states improve user experience
- Change detection prevents unnecessary database calls
- Console logs help with debugging (can be removed in production)

