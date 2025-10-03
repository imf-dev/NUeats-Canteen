# Analytics Page Database Integration

## Summary

The Analytics page has been successfully updated to fetch data from the Supabase database instead of using demo data.

## Changes Made

### 1. Created `src/lib/analyticsService.js`
A comprehensive service that handles all analytics data fetching from Supabase:

#### **`getTodaysAnalytics()`**
Fetches today's analytics summary with comparisons to yesterday:

**Returns:**
- `revenue` - Today's total revenue from completed orders
- `revenueGrowth` - Percentage change from yesterday
- `orders` - Total number of orders today (all statuses)
- `ordersGrowth` - Percentage change from yesterday
- `completionRate` - Percentage of orders completed vs total
- `avgOrderTime` - Average order preparation time (placeholder: 24 min)
- `totalCustomers` - Total unique customers (all time)
- `newCustomersToday` - Number of first-time customers today

**Data Sources:**
- `orders` table - Filtered by today's date and yesterday's date
- Compares completed orders and revenue between the two days
- Calculates unique user IDs for customer counts

#### **`getTopSellingItems(limit = 5)`**
Fetches top selling items of all time:

**Returns:** Array of top selling items with:
- `menuItemId` - Product ID
- `itemName` - Product name
- `itemCategory` - Product category
- `itemPrice` - Product price
- `unitsSold` - Total quantity sold
- `revenue` - Total revenue generated

**Data Sources:**
- `order_items` table joined with `orders` (completed only)
- `menu_items` table for product details
- Aggregates by product_id and sorts by units sold

#### **`getHourlyPerformance()`**
Fetches hourly sales data for today (8 AM - 5 PM):

**Returns:** Array of hourly data:
- `hour` - Hour of the day (8-17)
- `orders` - Number of orders in that hour
- `revenue` - Total revenue from completed orders in that hour

**Data Sources:**
- `orders` table filtered by today's date
- Groups orders by hour
- Only includes business hours (8 AM - 5 PM)

#### **`getAnalyticsData()`**
Fetches all analytics data in parallel for optimal performance.

### 2. Updated `src/screens/Analytics.jsx`

**Key Changes:**
- Replaced demo data imports with `getAnalyticsData` from analytics service
- Added loading state with `LoadingScreen` component
- Implemented `useEffect` to fetch data on component mount
- Added framer-motion page transitions for smooth UX
- State management for analytics data

**Features:**
- Loading screen on initial data fetch
- Smooth fade-in animation
- Error handling with console logging
- Fallback to empty/zero data on errors

## Database Schema Used

The integration uses the following Supabase tables:

1. **`orders`** - Order records with:
   - `order_id`, `user_id`, `total_amount`, `status`, `created_at`
   - Filters: status = "Completed" for revenue calculations
   
2. **`order_items`** - Items in each order with:
   - `order_id`, `product_id`, `quantity`, `price`
   - Joined with orders table to get completed orders only
   
3. **`menu_items`** - Product information:
   - `id`, `name`, `category`, `price`

## Analytics Calculations

### Revenue Growth
```javascript
revenueGrowth = ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100
```

### Orders Growth
```javascript
ordersGrowth = ((todayOrders - yesterdayOrders) / yesterdayOrders) * 100
```

### Completion Rate
```javascript
completionRate = (completedOrders / totalOrders) * 100
```

### New Customers Today
Customers who placed their first order today (user_id not in previous orders)

## Components

### A_SummaryCards
Displays 4 analytics cards:
1. **Today's Revenue** - With growth indicator
2. **Orders Today** - With growth indicator
3. **Completion Rate** - With average order time
4. **Total Customers** - With new customers today

### A_TopSelling
Bar chart showing top 5 selling items by units sold with hover tooltips showing:
- Item rank and name
- Units sold
- Total revenue

### A_HourlyPerformance
Line chart showing hourly performance (8 AM - 5 PM):
- Orders per hour
- Revenue per hour
- Interactive tooltips on hover

## Data Flow

```
Analytics.jsx (Screen)
    ↓
getAnalyticsData() (Service)
    ↓
Promise.all([
    getTodaysAnalytics(),
    getTopSellingItems(5),
    getHourlyPerformance()
])
    ↓
Supabase Queries (orders, order_items, menu_items)
    ↓
Data Aggregation & Calculations
    ↓
Return to Component
    ↓
Render Charts & Cards
```

## Expected Data

Based on your seeder:
- **Today's Revenue**: Should show revenue from 25-40 completed orders
- **Orders Today**: 30-45 total orders (25-40 completed + 5 active)
- **Completion Rate**: ~85% (based on seeder distribution)
- **Top Selling Items**: Items from menu_items with highest sales
- **Hourly Performance**: Orders distributed across 8 AM - 5 PM

## Performance Considerations

### Optimizations Implemented:
1. **Parallel Queries**: All analytics data fetched simultaneously using `Promise.all()`
2. **Efficient Filtering**: Date filtering done in query, not in memory
3. **Minimal Data Transfer**: Only selecting required columns
4. **Client-side Aggregation**: Grouping/sorting done in JavaScript for better performance

### Future Improvements:
1. **Caching**: Implement data caching for frequently accessed metrics
2. **Real-time Updates**: Add Supabase subscriptions for live analytics
3. **Date Range Selection**: Allow users to select custom date ranges
4. **Export Functionality**: Enable CSV/PDF export of analytics data
5. **Database Views**: Create Supabase views for complex aggregations
6. **Materialized Data**: Pre-calculate hourly/daily stats for faster queries

## Testing

Open the Analytics page and verify:

✅ **Summary Cards**
- Today's revenue shows real data
- Growth percentages are calculated correctly
- Orders count matches database
- Customer count is accurate

✅ **Top Selling Items**
- Shows actual best-selling products
- Bar heights are proportional
- Hover tooltips work correctly

✅ **Hourly Performance**
- Chart shows today's hourly distribution
- All hours (8 AM - 5 PM) are displayed
- Revenue and orders match expectations

✅ **Console Output**
```
Analytics: {todayRevenue: XXXX, todayOrderCount: XX, ...}
Top selling items: 5
Hourly performance data: 10 hours
```

## Known Limitations

1. **Average Order Time**: Currently a placeholder (24 min). To implement:
   - Need order status change timestamps
   - Calculate time between "Pending" → "Completed"

2. **New Customers**: Calculation is approximate
   - Better implementation would use a dedicated customers table
   - Or track first_order_date in user metadata

3. **Hourly Data**: Limited to today only
   - Could be enhanced to support historical hourly analysis

## Troubleshooting

**Issue**: Analytics show all zeros
- **Check**: Are there orders in the database for today?
- **Solution**: Run the orders seeder: `npm run seed:orders`

**Issue**: Top selling items are empty
- **Check**: Are there completed orders?
- **Solution**: Verify order statuses in database

**Issue**: Hourly chart is flat
- **Check**: Are orders created within 8 AM - 5 PM?
- **Solution**: Seeder only creates orders in business hours, should work correctly

## Success Metrics

The analytics integration is successful when:
- ✅ All data loads from database
- ✅ No demo/hardcoded values
- ✅ Real-time data reflects database state
- ✅ Performance is acceptable (<2s load time)
- ✅ No console errors
- ✅ Charts render correctly with real data
