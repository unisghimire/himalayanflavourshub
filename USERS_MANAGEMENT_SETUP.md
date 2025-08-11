# Users Management Setup for Admin Panel

This document explains how to set up and use the new Users Management section in the admin panel.

## Overview

The Users Management section allows administrators to:
- View all users from the `auth.users` table
- See user creation dates and last sign-in times
- View current roles assigned to each user
- Assign new roles to users
- Remove roles from users
- Search and sort users

## Database Setup

### 1. Run the SQL Functions

Execute the `supabase-users-function.sql` file in your Supabase SQL editor to create the necessary functions:

```sql
-- This will create:
-- - get_all_users_with_roles()
-- - assign_role_to_user()
-- - remove_role_from_user()
-- - get_user_roles_detailed()
```

### 2. Required Tables

Make sure you have the following tables set up (from `supabase-roles-schema.sql`):

- `roles` - Contains available roles (admin, user, etc.)
- `user_roles` - Links users to their assigned roles

### 3. Default Roles

The system expects at least these default roles:
- `admin` - Full administrative access
- `user` - Regular user access

## Features

### User Display
- **Email Address**: User's email from auth.users
- **Date Created**: When the user account was created
- **Last Sign In**: Most recent login timestamp
- **Current Roles**: Badges showing assigned roles
- **Actions**: View details, assign/remove roles

### Role Management
- **Assign Role**: Dropdown to select and assign a role
- **Remove Role**: Button to remove all roles from a user
- **Role Badges**: Visual indicators of current roles

### Search and Sort
- **Search**: Filter users by email address
- **Sort**: Sort by email, creation date, or last sign-in
- **Order**: Toggle between ascending/descending

## Security

### Access Control
- Only users with `admin` role can access this section
- All database operations are protected by RLS policies
- Custom functions check admin privileges before execution

### Data Protection
- Users can only see their own roles unless they're admin
- Role assignments are validated against existing roles
- Duplicate role assignments are prevented

## Usage Instructions

### 1. Access Users Tab
- Log into the admin panel with an admin account
- Click the "👥 Users" tab in the navigation

### 2. View Users
- Users are automatically loaded when the tab is opened
- Use the refresh buttons to reload data
- Search for specific users using the search box

### 3. Assign Roles
- Select a role from the dropdown in the "Assign Role" column
- The role will be immediately assigned to the user
- Success/error messages will be displayed

### 4. Remove Roles
- Click the 🗑️ button to remove all roles from a user
- Confirm the action in the popup dialog
- Roles will be removed immediately

### 5. View User Details
- Click the 👁️ button to see detailed user information
- Information includes user ID, email, dates, and roles

## Troubleshooting

### Common Issues

1. **"Access denied. Admin role required"**
   - Ensure your user account has the `admin` role
   - Check that the `is_admin()` function is working correctly

2. **"Failed to load users"**
   - Verify the custom functions are created in Supabase
   - Check browser console for detailed error messages
   - Ensure RLS policies are properly configured

3. **Role assignment fails**
   - Verify the role exists in the `roles` table
   - Check that the user exists in `auth.users`
   - Ensure no duplicate role assignments

### Debug Steps

1. Check browser console for JavaScript errors
2. Verify Supabase function permissions
3. Test RLS policies with direct database queries
4. Confirm user authentication status

## API Functions

### get_all_users_with_roles()
Returns all users with their assigned roles.

### assign_role_to_user(target_user_id, role_name)
Assigns a specific role to a user.

### remove_role_from_user(target_user_id, role_name)
Removes a specific role from a user.

### get_user_roles_detailed(user_uuid)
Returns detailed role information for a specific user.

## Styling

The users section uses custom CSS classes defined in `AdminPanel.css`:
- `.users-tab` - Main container styling
- `.users-table` - Table layout and appearance
- `.role-badge` - Role indicator styling
- `.role-select` - Role assignment dropdown
- `.user-actions-cell` - Action button layout

## Responsive Design

The users table is responsive and will:
- Scroll horizontally on mobile devices
- Stack controls vertically on small screens
- Maintain readability across all device sizes

## Future Enhancements

Potential improvements for the users management system:
- Bulk role operations
- User activity tracking
- Role hierarchy management
- User invitation system
- Audit logging for role changes
- Email notifications for role updates
