# Admin Dashboard Setup Guide

## Overview
The Himalayan Flavours Hub admin dashboard provides comprehensive management tools for products, orders, customers, and analytics. It features Google OAuth authentication for secure access.

## Features

### 🔐 Authentication
- **Google OAuth Sign-in**: Secure authentication using Google accounts
- **Admin Role Management**: Role-based access control
- **Session Management**: Automatic session handling

### 📊 Dashboard
- **Analytics Overview**: Sales, orders, customers, and average order value
- **Quick Actions**: Add products, view orders, export data, system health
- **Recent Activity**: Latest orders and low stock alerts
- **Real-time Updates**: Live data refresh capabilities

### 🛍️ Product Management
- **Product Catalog**: View all products with search and filtering
- **Stock Management**: Track inventory levels and low stock alerts
- **Product Actions**: Add, edit, delete, and view product details
- **Category Management**: Organize products by categories

### 📦 Order Management
- **Order Tracking**: View and manage all customer orders
- **Status Updates**: Update order status (pending, processing, shipped, completed)
- **Order Details**: View customer information and order contents
- **Export Functionality**: Export order data for analysis

### 👥 Customer Management
- **Customer Database**: View customer information and order history
- **Customer Analytics**: Track customer behavior and preferences
- **Communication Tools**: Send notifications and updates

### 📈 Analytics
- **Sales Analytics**: Revenue trends and performance metrics
- **Product Performance**: Best-selling products and inventory insights
- **Customer Insights**: Customer behavior and demographics
- **Business Intelligence**: Advanced reporting and data visualization

### ⚙️ System Settings
- **Configuration**: System-wide settings and preferences
- **User Management**: Admin user accounts and permissions
- **Security Settings**: Authentication and authorization controls
- **Backup & Recovery**: Data backup and system recovery options

## Setup Instructions

### 1. Google OAuth Configuration

#### Step 1: Create Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configure the OAuth consent screen
6. Add authorized redirect URIs:
   - `http://localhost:5173/admin` (for development)
   - `https://yourdomain.com/admin` (for production)

#### Step 2: Update Environment Variables
Add your Google OAuth credentials to your `.env` file:
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

### 2. Supabase Configuration

#### Step 1: Enable Google Auth in Supabase
1. Go to your Supabase project dashboard
2. Navigate to "Authentication" → "Providers"
3. Enable Google provider
4. Add your Google OAuth credentials:
   - Client ID: Your Google OAuth client ID
   - Client Secret: Your Google OAuth client secret

#### Step 2: Configure Redirect URLs
Add these redirect URLs in Supabase:
- `http://localhost:5173/admin`
- `https://yourdomain.com/admin`

### 3. Admin User Setup

#### Step 1: Create Admin Function
Execute this SQL in your Supabase SQL editor:
```sql
-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = user_uuid 
    AND raw_user_meta_data->>'role' = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION is_admin(UUID) TO anon, authenticated;
```

#### Step 2: Assign Admin Role
After a user signs in with Google, update their role:
```sql
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  raw_user_meta_data, 
  '{role}', 
  '"admin"'
) 
WHERE email = 'admin@yourdomain.com';
```

### 4. Database Schema

The admin dashboard works with the existing database schema. Ensure you have:
- `categories` table
- `products` table
- `orders` table (if implementing order management)
- `users` table (if implementing customer management)

## Usage

### Accessing the Admin Dashboard
1. Navigate to `/admin` in your application
2. Click "Sign in with Google"
3. Authenticate with your Google account
4. If you have admin privileges, you'll be redirected to the dashboard

### Navigation
- **Dashboard**: Overview and quick actions
- **Products**: Manage product catalog and inventory
- **Orders**: Track and manage customer orders
- **Customers**: View customer information and analytics
- **Analytics**: Business intelligence and reporting
- **Settings**: System configuration and user management

### Key Features

#### Product Management
- Add new products with images, descriptions, and pricing
- Update product information and inventory levels
- Set product status (active, inactive, out of stock)
- Organize products by categories

#### Order Management
- View all customer orders with filtering and search
- Update order status and tracking information
- Export order data for external processing
- Monitor order fulfillment and delivery

#### Analytics Dashboard
- Real-time sales and revenue metrics
- Product performance analysis
- Customer behavior insights
- Inventory optimization recommendations

## Security Considerations

### Authentication
- All admin routes require Google OAuth authentication
- Session management with automatic timeout
- Secure token handling and storage

### Authorization
- Role-based access control (RBAC)
- Admin-only routes and functionality
- Audit logging for admin actions

### Data Protection
- Encrypted data transmission (HTTPS)
- Secure database connections
- Regular security updates and patches

## Customization

### Styling
The admin dashboard uses Tailwind CSS and can be customized by:
- Modifying color schemes in `tailwind.config.js`
- Updating component styles in individual files
- Adding custom CSS classes

### Functionality
Extend the admin dashboard by:
- Adding new tabs and sections
- Implementing additional CRUD operations
- Integrating third-party services
- Adding custom analytics and reporting

### Branding
Customize the admin interface to match your brand:
- Update logos and images
- Modify color schemes and typography
- Add custom branding elements

## Troubleshooting

### Common Issues

#### Google OAuth Not Working
- Verify Google OAuth credentials are correct
- Check redirect URIs match exactly
- Ensure Google+ API is enabled
- Check browser console for error messages

#### Admin Access Denied
- Verify user has admin role in database
- Check `is_admin` function is working correctly
- Ensure user email is in admin list

#### Database Connection Issues
- Verify Supabase credentials
- Check network connectivity
- Review database permissions and RLS policies

### Support
For technical support or feature requests:
1. Check the documentation
2. Review error logs in browser console
3. Contact the development team

## Future Enhancements

### Planned Features
- **Advanced Analytics**: Machine learning insights and predictions
- **Inventory Management**: Automated reorder points and supplier integration
- **Customer Communication**: Email marketing and notification system
- **Multi-language Support**: Internationalization for global markets
- **Mobile Admin App**: Native mobile application for admin tasks

### Integration Opportunities
- **Payment Processing**: Stripe, PayPal integration
- **Shipping**: FedEx, UPS, DHL integration
- **Marketing**: Mailchimp, HubSpot integration
- **Accounting**: QuickBooks, Xero integration
- **CRM**: Salesforce, HubSpot integration

---

**Note**: This admin dashboard is designed for the Himalayan Flavours Hub e-commerce platform. Customize the branding, features, and functionality to match your specific business requirements.
