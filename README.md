# NUeats-Canteen

Admin portal built with React + Vite.

## Environment Setup

Create a `.env` file at the project root and set the following keys:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Get these from your Supabase Project Settings → API. Restart `npm run dev` after adding them.

**Note:** The `SUPABASE_SERVICE_ROLE_KEY` is only required for running database seeders. It should never be exposed in client-side code.

## Database Seeders

This project includes database seeders to populate your Supabase database with sample data.

### Prerequisites

1. Ensure your `.env` file contains `SUPABASE_URL` (or `VITE_SUPABASE_URL`) and `SUPABASE_SERVICE_ROLE_KEY`
2. Install dependencies: `npm install`

### Available Seeders

#### Seed Menu Items
Populates the `menu_items` table with sample menu data:

```bash
npm run seed:menu
```

#### Seed Orders
Populates the `orders`, `order_items`, and `payments` tables with sample order data:

```bash
npm run seed:orders
```

This seeder generates:
- Orders for the past 7 days:
  - **Past 6 days**: 40-80 orders per day (85% Completed, 15% Cancelled)
  - **Today**: 25-40 Completed orders + 5 active orders (Pending/Preparing/Ready)
- Order times between 8am-5pm
- Order items referencing menu items from the menu seeder
- Payment records for each order (Cash or Paymongo)
- Realistic payment statuses based on order status

**Important:** Run `npm run seed:menu` before `npm run seed:orders` to ensure menu items exist.

## Database Integrations

The following features are fully integrated with the Supabase database:

### Admin Settings (Settings Page)
- **Profile Management**: Update admin name, email, phone, and profile picture
- **Password Management**: Secure password updates through Supabase Auth
- **Security Settings**: Configure 2FA, login notifications, session timeout, and password expiry
- **Documentation**: See [ADMIN_SETTINGS_DATABASE_INTEGRATION.md](ADMIN_SETTINGS_DATABASE_INTEGRATION.md)

### Store Settings (Settings Page)
- **Canteen Information**: Configure name, description, contact details, and address
- **Operating Hours**: Set daily schedule for each day of the week
- **Payment Methods**: Enable/disable accepted payment options (Cash, PayMongo, Card)
- **Documentation**: See [STORE_SETTINGS_DATABASE_INTEGRATION.md](STORE_SETTINGS_DATABASE_INTEGRATION.md)

### Customers Management
- **All Customers**: View and search customer data from orders
- **Customer Analytics**: Real-time analytics and feedback
- **Complaints**: Manage customer complaints with responses
- **Documentation**: See [CUSTOMERS_DATABASE_INTEGRATION.md](CUSTOMERS_DATABASE_INTEGRATION.md)

### Dashboard
- **Real-time Order Tracking**: Live orders from database
- **Sales Analytics**: Weekly and daily sales data
- **Top Selling Items**: Most popular menu items
- **Documentation**: See [DASHBOARD_DATABASE_INTEGRATION.md](DASHBOARD_DATABASE_INTEGRATION.md)

### Analytics
- **Sales Performance**: Hourly and daily sales trends
- **Revenue Tracking**: Total revenue and order counts
- **Popular Items**: Best-selling menu items
- **Documentation**: See [ANALYTICS_INTEGRATION.md](ANALYTICS_INTEGRATION.md)

## Database Migrations

Database schema changes are managed through SQL migration files in the `migrations/` folder.

### Running Migrations

1. Navigate to your Supabase project dashboard
2. Go to the SQL Editor
3. Run the migration files in the `migrations/` folder

See [migrations/README.md](migrations/README.md) for detailed instructions.

### Required Migrations

For the Settings features, run these migrations in order:

1. **`setup_avatars_storage.sql`** - Sets up storage policies for profile pictures
   - First create the `avatars` bucket manually in Supabase Dashboard (set it to Public)
   - Then run this migration to configure access policies

2. **`add_security_settings_to_profiles.sql`** - Adds security settings support for Admin Profile & Credentials

3. **`create_store_settings_table.sql`** - Creates table for Store Settings (canteen info, hours, payment methods)