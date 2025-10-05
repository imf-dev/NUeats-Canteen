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