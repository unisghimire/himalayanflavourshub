# Supabase Admin Authentication Setup Guide

This guide will help you set up admin authentication for your Himalayan Flavours Hub using Supabase's built-in auth system.

## Step 1: Enable Email Authentication in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Make sure **Email** provider is enabled
4. Configure email settings as needed

## Step 2: Create Admin User

### Option A: Using Supabase Dashboard (Recommended for first admin)

1. Go to **Authentication** → **Users**
2. Click **"Add User"**
3. Fill in the details:
   - **Email**: Your admin email (e.g., `admin@himalayanflavours.com`)
   - **Password**: Choose a strong password
   - **Email Confirm**: Check this to auto-confirm the email
4. Click **"Create User"**

### Option B: Using SQL (Advanced users)

Run this SQL in your Supabase SQL Editor:

```sql
-- Create admin user (replace with your desired email and password)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_sent_at,
  recovery_sent_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@himalayanflavours.com', -- Replace with your admin email
  crypt('your_secure_password_here', gen_salt('bf')), -- Replace with your password
  now(),
  now(),
  now(),
  '',
  '',
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  false,
  now(),
  now()
);
```

## Step 3: Configure Row Level Security (RLS)

Since you're using the `auth.users` table for authentication, you don't need to modify it. However, you might want to add RLS policies to your `emails` table to restrict access to authenticated users only.

### Optional: Restrict Email Access to Authenticated Users

```sql
-- Drop the existing public read policy
DROP POLICY IF EXISTS "Allow public email reading" ON emails;

-- Create new policy that only allows authenticated users to read emails
CREATE POLICY "Allow authenticated users to read emails" ON emails
    FOR SELECT USING (auth.role() = 'authenticated');

-- Keep the public insert policy for email collection
-- (This allows anyone to submit emails through your form)
```

## Step 4: Test the Login

1. Go to your app's `/login` page
2. Use the email and password you created in Step 2
3. You should be redirected to the admin panel after successful login

## Step 5: Additional Security Considerations

### Password Requirements
- Minimum 6 characters (Supabase default)
- Consider using a password manager for strong passwords

### Session Management
- Sessions are managed automatically by Supabase
- Users stay logged in until they explicitly sign out or the session expires
- You can configure session duration in Supabase settings

### Multi-Factor Authentication (Optional)
If you want additional security, you can enable MFA in Supabase:
1. Go to **Authentication** → **Settings**
2. Enable **Multi-Factor Authentication**
3. Configure MFA settings as needed

## Troubleshooting

### Common Issues:

1. **"Invalid login credentials"**
   - Check that the email and password are correct
   - Ensure the user exists in Supabase
   - Verify the email is confirmed

2. **"Email not confirmed"**
   - Check if email confirmation is required in your Supabase settings
   - You can auto-confirm emails during user creation

3. **Authentication state not persisting**
   - Check browser console for errors
   - Ensure Supabase client is properly configured
   - Verify environment variables are set correctly

### Debug Commands:

You can test authentication in the browser console:

```javascript
// Check if user is authenticated
const { data: { session } } = await supabase.auth.getSession()
console.log('Session:', session)

// Get current user
const { data: { user } } = await supabase.auth.getUser()
console.log('User:', user)
```

## Next Steps

After setting up admin authentication:

1. **Test the complete flow**: Login → Admin Panel → Logout
2. **Customize the admin interface**: Add more admin features as needed
3. **Monitor usage**: Check Supabase logs for any authentication issues
4. **Add more admin users**: Create additional admin accounts if needed

## Security Best Practices

1. **Use strong passwords** for admin accounts
2. **Regularly rotate passwords** for production environments
3. **Monitor authentication logs** in Supabase dashboard
4. **Consider IP restrictions** for admin access in production
5. **Enable audit logging** if available in your Supabase plan

---

Your admin authentication is now fully integrated with Supabase! 🎉
