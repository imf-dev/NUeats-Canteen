# NUeats-Canteen Code Structure

```
NUeats-Canteen                          # React + Vite canteen admin portal web application
|
├── public/                             # Static assets served directly by web server
│   ├── favicon.png                     # Website favicon icon
│   └── vite.svg                        # Vite framework logo
|
├── src/                                # Main source code directory
│   ├── App.jsx                         # Main application component with routing logic
│   ├── App.css                         # Global application styles
│   ├── main.jsx                        # Application entry point and React DOM rendering
│   ├── index.css                       # Global CSS styles and reset
│   │
│   ├── assets/                         # Static media files and images
│   │   ├── bg.png                      # Background image
│   │   ├── canteen.jpg                 # Canteen photo
│   │   ├── nu_only_blue.png            # NU logo (blue version)
│   │   ├── nu_only_yellow.png          # NU logo (yellow version)
│   │   ├── nu_only.png                 # NU logo (default)
│   │   ├── NUeats_wshadow.png          # NUeats logo with shadow
│   │   ├── NUeats.png                  # NUeats main logo
│   │   └── react.svg                   # React framework logo
│   │
│   ├── screens/                        # Main page components (route destinations)
│   │   ├── LoginPage.jsx               # User authentication and login interface
│   │   ├── ResetPassword.jsx           # Password recovery functionality
│   │   ├── Dashboard.jsx               # Main dashboard with orders and sales overview
│   │   ├── Orders.jsx                  # Order management and tracking system
│   │   ├── Menu.jsx                    # Menu items management interface
│   │   ├── Analytics.jsx               # Sales analytics and performance metrics
│   │   ├── Customers.jsx               # Customer data and relationship management
│   │   └── Settings.jsx                # Admin and store configuration settings
│   │
│   ├── components/                     # Reusable UI components organized by feature
│   │   ├── common/                     # Shared components used across multiple screens
│   │   │   ├── CustomModal.jsx         # Reusable modal dialog component
│   │   │   ├── LoadingScreen.jsx       # Loading state indicator
│   │   │   ├── ScrollUpButton.jsx      # Scroll to top functionality
│   │   │   └── Sidebar.jsx             # Main navigation sidebar
│   │   │
│   │   ├── Dashboard/                  # Dashboard-specific components
│   │   │   ├── D_CurrentOrders.jsx     # Live order tracking display
│   │   │   ├── D_SummaryCards.jsx      # Key metrics summary cards
│   │   │   ├── D_TopSellingCard.jsx    # Best-selling items widget
│   │   │   └── D_WeeklyCard.jsx        # Weekly sales performance chart
│   │   │
│   │   ├── Orders/                     # Order management components
│   │   │   ├── O_Cards.jsx             # Order display cards
│   │   │   └── O_Modal.jsx             # Order details modal dialog
│   │   │
│   │   ├── Menu/                       # Menu management components
│   │   │   ├── M_Cards.jsx             # Menu item display cards
│   │   │   └── MenuAddEdit.jsx         # Add/edit menu item form
│   │   │
│   │   ├── Analytics/                  # Analytics and reporting components
│   │   │   ├── A_SummaryCards.jsx      # Analytics summary metrics
│   │   │   ├── A_HourlyPerformance.jsx # Hourly sales performance chart
│   │   │   └── A_TopSelling.jsx        # Top selling items analytics
│   │   │
│   │   ├── Customers/                  # Customer management components
│   │   │   ├── AllCustomers/           # Customer listing components
│   │   │   │   ├── CAC_CustomerList.jsx # Customer data table
│   │   │   │   ├── CAC_CustomerDetails.jsx # Individual customer details
│   │   │   │   └── CAC_SearchFilters.jsx # Customer search filters
│   │   │   ├── Analytics/              # Customer analytics components
│   │   │   │   ├── CA_NewUsers.jsx     # New customer registration trends
│   │   │   │   ├── CA_CustomerFeedback.jsx # Customer feedback analysis
│   │   │   │   └── CA_RatingDistribution.jsx # Rating distribution charts
│   │   │   ├── Complaints/             # Customer complaint management
│   │   │   │   ├── CC_ComplaintCards.jsx # Complaint display cards
│   │   │   │   ├── CC_ComplaintFilters.jsx # Complaint filtering system
│   │   │   │   └── CC_ResponseModal.jsx # Complaint response interface
│   │   │   ├── CustomerStats.jsx       # Customer statistics overview
│   │   │   └── CustomerAnalytics.jsx   # Customer behavior analytics
│   │   │
│   │   ├── Settings/                   # Settings and configuration components
│   │   │   ├── SettingsAdmin/          # Admin profile settings
│   │   │   │   ├── SA_AdminProfile.jsx # Admin profile management
│   │   │   │   ├── SA_ChangePass.jsx   # Password change functionality
│   │   │   │   └── SA_SecuritySettings.jsx # Security configuration
│   │   │   └── SettingsStore/          # Store configuration settings
│   │   │       ├── SS_CanteenInfo.jsx  # Canteen information setup
│   │   │       ├── SS_OperatingHours.jsx # Operating hours configuration
│   │   │       └── SS_PaymentMethod.jsx # Payment methods setup
│   │   │
│   │   ├── ProtectedRoute.jsx          # Route protection for authenticated users
│   │   └── styles/                     # Component-specific CSS files
│   │       ├── CustomModal.css         # Modal component styles
│   │       └── Sidebar.css             # Sidebar component styles
│   │
│   ├── lib/                            # Business logic and service layer
│   │   ├── supabaseClient.js           # Supabase database connection setup
│   │   ├── dashboardService.js         # Dashboard data fetching services
│   │   ├── analyticsService.js         # Analytics data processing services
│   │   ├── customersService.js         # Customer data management services
│   │   ├── customerAnalyticsService.js # Customer analytics processing
│   │   ├── complaintsService.js        # Complaint management services
│   │   ├── profileService.js           # Admin profile management services
│   │   ├── storeSettingsService.js     # Store configuration services
│   │   └── sendOrderEmail.js           # Email notification services
│   │
│   ├── demodata/                       # Sample data for development and testing
│   │   ├── adminDemoData.js            # Sample admin profile data
│   │   ├── dashboardDemoData.js        # Sample dashboard metrics
│   │   ├── ordersDemoData.js           # Sample order records
│   │   ├── menuDemoData.js             # Sample menu items
│   │   ├── allcustomersDemoData.js     # Sample customer records
│   │   ├── complaintsDemoData.js       # Sample complaint data
│   │   ├── salesDemoData.js            # Sample sales analytics
│   │   └── storeDemoData.js            # Sample store configuration
│   │
│   └── styles/                         # Screen-specific CSS files
│       ├── LoginPage.css               # Login page styling
│       ├── Dashboard.css               # Dashboard page styling
│       ├── Orders.css                  # Orders page styling
│       ├── Menu.css                    # Menu page styling
│       ├── Analytics.css               # Analytics page styling
│       ├── Customers.css               # Customers page styling
│       └── Settings.css                # Settings page styling
|
├── supabase/                           # Supabase backend configuration
│   ├── config.toml                     # Supabase project configuration
│   └── functions/                      # Serverless edge functions
│       ├── payment/                    # Payment processing functions
│       │   ├── index.ts                # Payment gateway integration
│       │   └── deno.json               # Deno runtime configuration
│       ├── paymongo-webhook/           # PayMongo webhook handlers
│       │   ├── index.ts                # Webhook event processing
│       │   └── deno.json               # Deno runtime configuration
│       └── send-emails/                # Email notification functions
│           ├── index.ts                # Email sending logic
│           └── deno.json               # Deno runtime configuration
|
├── migrations/                         # Database schema migrations
│   ├── README.md                       # Migration instructions
│   ├── setup_avatars_storage.sql       # Profile picture storage setup
│   ├── add_security_settings_to_profiles.sql # Security settings schema
│   └── create_store_settings_table.sql # Store configuration schema
|
├── scripts/                            # Database seeding and utility scripts
│   ├── seedMenuItems.mjs               # Populate menu items table
│   ├── seedOrders.mjs                  # Generate sample order data
│   ├── seedComplaints.mjs              # Create sample complaint records
│   └── syncProfilesFromAuth.mjs        # Sync user profiles from authentication
|
├── debug-orders.html                   # Order debugging interface
├── debug-orders.js                     # Order debugging logic
├── package.json                        # Node.js dependencies and scripts
├── package-lock.json                   # Dependency version lock file
├── vite.config.js                      # Vite build tool configuration
├── eslint.config.js                    # ESLint code quality configuration
├── index.html                          # Main HTML entry point
├── README.md                           # Project documentation and setup guide
|
└── Documentation Files/                # Feature documentation and integration guides
    ├── ADMIN_SETTINGS_DATABASE_INTEGRATION.md    # Admin settings implementation
    ├── ADMIN_SETTINGS_SETUP.md                   # Admin settings setup guide
    ├── ANALYTICS_INTEGRATION.md                  # Analytics feature documentation
    ├── CUSTOMERS_DATABASE_INTEGRATION.md         # Customer management implementation
    ├── DASHBOARD_DATABASE_INTEGRATION.md         # Dashboard integration guide
    ├── DASHBOARD_FIXES.md                        # Dashboard bug fixes log
    ├── STORAGE_INTEGRATION_SUMMARY.md            # File storage implementation
    ├── STORAGE_POLICY_FIX.md                     # Storage policy fixes
    ├── STORE_SETTINGS_DATABASE_INTEGRATION.md    # Store settings implementation
    ├── STORE_SETTINGS_INTEGRATION_SUMMARY.md     # Store settings summary
    └── STORE_SETTINGS_SETUP.md                   # Store settings setup guide
```

## Architecture Overview

**Frontend**: React 19 + Vite + React Router for SPA navigation
**Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
**Styling**: CSS Modules with component-specific stylesheets
**State Management**: React hooks with Supabase real-time subscriptions
**Authentication**: Supabase Auth with protected routes
**Payments**: PayMongo integration via Supabase Edge Functions
**Email**: Automated notifications via Supabase Edge Functions

## Key Features

- **Real-time Order Management**: Live order tracking and status updates
- **Sales Analytics**: Comprehensive reporting and performance metrics
- **Customer Management**: Customer data, feedback, and complaint handling
- **Admin Portal**: Profile management and security settings
- **Store Configuration**: Operating hours, payment methods, and canteen info
- **Database Integration**: Full CRUD operations with Supabase
- **Responsive Design**: Mobile-friendly admin interface