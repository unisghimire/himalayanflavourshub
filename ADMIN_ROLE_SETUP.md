# Admin Role Setup Guide

This guide will help you set up role-based access control for the Himalayan Flavours Hub Admin Panel.

## 🚀 Quick Setup Steps

### 1. Run the Database Schema
Execute the following SQL files in your Supabase SQL Editor in this order:

1. **`supabase-roles-schema.sql`** - Creates the roles and user_roles tables
2. **`supabase-content-schema.sql`** - Your existing content schema (if not already run)

### 2. Assign Admin Role to Your User

After running the schema, you need to assign the admin role to your user account:

#### Option A: Using the Helper Function
```sql
-- Replace 'your-email@example.com' with your actual email
SELECT assign_admin_role_by_email('your-email@example.com');
```

#### Option B: Manual Assignment
```sql
-- 1. Find your user ID first:
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- 2. Assign admin role (replace USER_UUID with the actual UUID from step 1):
INSERT INTO user_roles (user_id, role_id) 
SELECT 'USER_UUID', r.id 
FROM roles r 
WHERE r.name = 'admin'
ON CONFLICT (user_id, role_id) DO NOTHING;
```

## 🔐 How It Works

### Authentication Flow
1. User signs in with Google OAuth
2. System checks if user is authenticated
3. System checks if user has admin role
4. If admin: Access granted to admin panel
5. If not admin: Access denied message shown

### Role System
- **`roles` table**: Stores available roles (admin, user)
- **`user_roles` table**: Links users to their roles
- **`is_admin()` function**: Checks if a user has admin privileges
- **`get_user_roles()` function**: Gets all roles for a user

## 🛡️ Security Features

- **Row Level Security (RLS)**: Enabled on all role-related tables
- **Function Security**: Database functions use `SECURITY DEFINER`
- **Policy-based Access**: Only authenticated users can read role information
- **Cascade Deletion**: User roles are automatically removed when users are deleted

## 🔧 Testing the Setup

1. **Sign in with Google** using your admin account
2. **Check admin panel access** - should work normally
3. **Sign in with a non-admin account** - should show "Access Denied"
4. **Verify role assignment** in Supabase dashboard

## 📋 Database Tables Created

### `roles`
- `id`: Primary key
- `name`: Role name (admin, user)
- `description`: Role description
- `created_at`, `updated_at`: Timestamps

### `user_roles`
- `id`: Primary key
- `user_id`: References auth.users(id)
- `role_id`: References roles(id)
- `created_at`, `updated_at`: Timestamps

## 🚨 Troubleshooting

### Common Issues

1. **"Function not found" error**
   - Ensure you've run `supabase-roles-schema.sql` completely
   - Check that all functions were created successfully

2. **"Access Denied" for admin users**
   - Verify the user has been assigned the admin role
   - Check the `user_roles` table for the correct entry

3. **Authentication works but admin check fails**
   - Ensure the `is_admin()` function exists and is accessible
   - Check RLS policies are correctly configured

### Verification Queries

```sql
-- Check if roles exist
SELECT * FROM roles;

-- Check if your user has admin role
SELECT 
  u.email,
  r.name as role_name
FROM auth.users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE u.email = 'your-email@example.com';

-- Test the is_admin function
SELECT is_admin();
```

## 🔄 Adding More Admin Users

To add additional admin users:

```sql
-- Assign admin role to another user
SELECT assign_admin_role_by_email('new-admin@example.com');
```

## 🎯 Next Steps

After setup:
1. Test admin access with your account
2. Test access denial with non-admin accounts
3. Consider adding more granular permissions if needed
4. Monitor admin access logs for security

## 📞 Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify all SQL scripts executed successfully
3. Ensure your Supabase project has the correct permissions
4. Check that RLS policies are properly configured
