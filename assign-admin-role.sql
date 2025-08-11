-- Script to assign admin role to a specific user
-- Replace 'your-email@example.com' with the actual admin user's email

-- First, get the user ID from auth.users table
-- Then assign the admin role to that user

-- Example usage:
-- 1. Find your user ID first:
-- SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- 2. Then run this (replace USER_UUID with the actual UUID from step 1):
-- INSERT INTO user_roles (user_id, role_id) 
-- SELECT 'USER_UUID', r.id 
-- FROM roles r 
-- WHERE r.name = 'admin'
-- ON CONFLICT (user_id, role_id) DO NOTHING;

-- Or use this function to assign admin role by email:
CREATE OR REPLACE FUNCTION assign_admin_role_by_email(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_uuid UUID;
  role_id_val INTEGER;
BEGIN
  -- Get user ID from email
  SELECT id INTO user_uuid 
  FROM auth.users 
  WHERE email = user_email;
  
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
  
  -- Get admin role ID
  SELECT id INTO role_id_val 
  FROM roles 
  WHERE name = 'admin';
  
  IF role_id_val IS NULL THEN
    RAISE EXCEPTION 'Admin role not found';
  END IF;
  
  -- Assign admin role
  INSERT INTO user_roles (user_id, role_id) 
  VALUES (user_uuid, role_id_val)
  ON CONFLICT (user_id, role_id) DO NOTHING;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION assign_admin_role_by_email(TEXT) TO authenticated;

-- Example: Assign admin role to a user (replace with actual email)
-- SELECT assign_admin_role_by_email('your-email@example.com');
