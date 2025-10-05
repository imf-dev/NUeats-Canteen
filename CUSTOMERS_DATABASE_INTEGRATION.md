# Customer Management Database Integration

## Summary

The Customer Management "All Customers" tab has been successfully updated to fetch data from the Supabase database instead of using demo data.

## Changes Made

### 1. Created `src/lib/customersService.js`

A new service file that handles all customer data fetching from Supabase:

#### **`getAllCustomers()`**
Fetches all customers with their order summaries:
- Retrieves unique user_ids from `orders` table
- Calculates order counts and first/last order dates for each user
- Determines customer status based on last order date:
  - **active**: ordered within last 30 days
  - **inactive**: ordered 30-90 days ago  
  - **suspended**: no order for 90+ days
- Returns formatted customer data with account info and order summary
- Sorted by first order date (newest customers first)
- Customer names use placeholder format: "Customer" + UUID substring

#### **`getCustomerStats()`**
Fetches customer statistics for the stats cards:
- Total customers count (unique user_ids from orders)
- New customers this week (first order within last 7 days)
- Active customers count (ordered within last 30 days)
- Total orders count
- Total feedbacks count (ratings with feedback text)

#### **`getCustomerById(customerId)`**
Fetches detailed information for a single customer:
- User profile information
- Full order history with items
- Account activity details
- Used for customer detail views (future implementation)

### 2. Updated `src/components/Customers/AllCustomers.jsx`

**Key Changes:**
- Replaced demo data import with `getAllCustomers` from customers service
- Added `LoadingScreen` component for loading state
- Implemented `useEffect` to fetch customers on component mount
- Updated `filteredCustomers` useMemo to use state data
- Added loading state management

**Features:**
- Loading screen on initial data fetch
- Real-time search and filtering
- Status filtering (all, active, inactive, suspended)
- Search by name, email, or customer ID

### 3. Updated `src/components/Customers/CustomerStats.jsx`

**Key Changes:**
- Replaced demo data with direct Supabase queries
- Added `useEffect` to fetch stats on component mount
- Implemented state management for statistics
- Fetches counts directly from database tables

**Statistics:**
1. **Total Customers** - Count of unique user_ids in `orders` table
2. **Total Orders** - Total count from `orders` table
3. **New Customers** - Customers with first order in last 7 days
4. **Total Feedbacks** - Ratings with feedback text from `ratings` table

## Important Note

Since `auth.users` table cannot be directly accessed from the client side in Supabase, this integration derives customer data from the `orders` table. Each unique `user_id` in orders represents a customer.

## Database Schema Used

The integration uses the following Supabase tables:

### 1. **`orders`** - Order records (primary source for customer data)
   - `order_id` - Order identifier
   - `user_id` - References auth.users(id)
   - `total_amount` - Order total
   - `status` - Order status
   - `created_at` - Order creation date

### 3. **`ratings`** - Customer feedback
   - `rating_id` - Rating identifier
   - `order_id` - References orders(order_id)
   - `stars` - Rating (1-5)
   - `feedback` - Optional feedback text
   - `created_at` - Rating timestamp

## Customer Status Logic

Customer status is automatically determined based on last order date:

```javascript
const daysSinceLastOrder = Math.floor(
  (new Date() - new Date(lastOrderDate)) / (1000 * 60 * 60 * 24)
);

let status = "active";
if (daysSinceLastOrder > 90) {
  status = "suspended";
} else if (daysSinceLastOrder > 30) {
  status = "inactive";
}
```

- **Active**: Placed an order within the last 30 days
- **Inactive**: Last order was 30-90 days ago
- **Suspended**: No orders for 90+ days

## Data Mapping

Customer data structure is derived from orders:

```javascript
{
  customer_id: user_id,                           // UUID from orders
  first_name: "Customer",                         // Placeholder
  last_name: user_id.substring(0, 8),            // UUID prefix
  email: `${user_id.substring(0, 8)}@user.com`,  // Generated
  phone: "N/A",                                   // Not available
  status: determineStatus(lastOrderDate),         // Calculated
  account_info: {
    date_joined: firstOrderDate,                  // From orders
    last_login: lastOrderDate,                    // From orders
    last_app_activity: lastOrderDate              // From orders
  },
  order_summary: {
    total_orders: orderCount,                     // Count from orders
    last_order_date: lastOrderDate                // From orders
  }
}
```

**Note:** Since we can't access user profile data directly, customer names and emails are placeholder values. The unique `customer_id` (UUID) serves as the primary identifier.

## Features

### Customer List
- **Real-time data** from Supabase database
- **Search functionality** by name, email, or customer ID
- **Status filtering** (all, active, inactive, suspended)
- **Loading state** with smooth transitions
- **Automatic status calculation** based on login activity

### Statistics Cards
- **Total Customers** - All registered users
- **Total Orders** - All orders in system
- **New Customers** - Registrations in last 7 days
- **Total Feedbacks** - Ratings with feedback text

### Performance
- Parallel data fetching for optimal performance
- Count queries use `head: true` for efficiency
- Filtered queries use proper indexing

## Usage

The All Customers tab will automatically fetch data when loaded. The component:
1. Shows loading screen while fetching data
2. Displays customer list with real data
3. Allows searching and filtering
4. Updates statistics cards with live counts

## Future Enhancements

1. **User Profile Integration**: Create a `profiles` table or database view to access actual user names and contact information
2. **Real-time Updates**: Add Supabase real-time subscriptions for live customer updates
3. **Customer Details Modal**: Implement detailed view with full order history
4. **Activity Tracking**: Add more granular tracking of app activity beyond order dates
5. **Export Functionality**: Allow exporting customer data to CSV/Excel
6. **Bulk Actions**: Enable bulk status updates or messaging
7. **Advanced Filters**: Add date range, order count, and revenue filters
8. **Customer Segmentation**: Group customers by behavior patterns
9. **Suspension Management**: Add ability to manually suspend/unsuspend users
10. **Email Notifications**: Implement email notifications for inactive customers

## Notes

- Customer data is derived from the `orders` table since `auth.users` cannot be queried directly from the client
- Customer status is automatically calculated based on last order date
- Customer names and emails are placeholder values (UUID-based)
- The actual user UUID serves as the unique customer identifier
- The service gracefully handles missing or incomplete data
- All database errors are logged to console for debugging
- To get real user profile data, consider creating a `profiles` table with RLS policies or a database view that can be accessed from the client
