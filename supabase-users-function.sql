-- Custom function to get all users with their roles for admin panel
-- This function allows admins to view all users and their assigned roles
-- 
-- IMPORTANT: If you already have these functions created, you need to DROP them first
-- or use CREATE OR REPLACE to update them with the correct types.
-- 
-- The functions use VARCHAR(255) instead of TEXT to match Supabase's expected types
-- and avoid the "structure of query does not match function result type" error.

-- Create function to get all users with their roles
CREATE OR REPLACE FUNCTION get_all_users_with_roles()
RETURNS TABLE(
  user_id UUID,
  email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE,
  last_sign_in_at TIMESTAMP WITH TIME ZONE,
  roles VARCHAR(255)[]
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the current user has admin role
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;
  
  RETURN QUERY
  SELECT 
    u.id as user_id,
    u.email::VARCHAR(255),
    u.created_at,
    u.last_sign_in_at,
    COALESCE(
      ARRAY_AGG(r.name::VARCHAR(255) ORDER BY r.name) FILTER (WHERE r.name IS NOT NULL),
      ARRAY[]::VARCHAR(255)[]
    ) as roles
  FROM auth.users u
  LEFT JOIN user_roles ur ON u.id = ur.user_id
  LEFT JOIN roles r ON ur.role_id = r.id
  GROUP BY u.id, u.email, u.created_at, u.last_sign_in_at
  ORDER BY u.email;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_all_users_with_roles() TO authenticated;

-- Create function to assign role to user
CREATE OR REPLACE FUNCTION assign_role_to_user(
  target_user_id UUID,
  role_name VARCHAR(255)
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  found_role_id INTEGER;
BEGIN
  -- Check if the current user has admin role
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;
  
  -- Get the role ID
  SELECT id INTO found_role_id FROM roles WHERE name = role_name;
  
  IF found_role_id IS NULL THEN
    RAISE EXCEPTION 'Role "%" not found.', role_name;
  END IF;
  
  -- Insert the user role (ignore if already exists)
  INSERT INTO user_roles (user_id, role_id)
  VALUES (target_user_id, found_role_id)
  ON CONFLICT (user_id, role_id) DO NOTHING;
  
  RETURN TRUE;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION assign_role_to_user(UUID, VARCHAR(255)) TO authenticated;

-- Create function to remove role from user
CREATE OR REPLACE FUNCTION remove_role_from_user(
  target_user_id UUID,
  role_name VARCHAR(255)
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  found_role_id INTEGER;
BEGIN
  -- Check if the current user has admin role
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;
  
  -- Get the role ID
  SELECT id INTO found_role_id FROM roles WHERE name = role_name;
  
  -- Remove the user role
  DELETE FROM user_roles 
  WHERE user_id = target_user_id AND role_id = found_role_id;
  
  RETURN TRUE;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION remove_role_from_user(UUID, VARCHAR(255)) TO authenticated;

-- Create function to get user's current roles
CREATE OR REPLACE FUNCTION get_user_roles_detailed(user_uuid UUID)
RETURNS TABLE(
  role_id INTEGER,
  role_name VARCHAR(255),
  role_description VARCHAR(500)
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the current user has admin role or is requesting their own roles
  IF NOT (is_admin() OR auth.uid() = user_uuid) THEN
    RAISE EXCEPTION 'Access denied.';
  END IF;
  
  RETURN QUERY
  SELECT 
    r.id as role_id,
    r.name as role_name,
    r.description as role_description
  FROM user_roles ur
  JOIN roles r ON ur.role_id = r.id
  WHERE ur.user_id = user_uuid
  ORDER BY r.name;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_roles_detailed(UUID) TO authenticated;

-- Add RLS policies for user_roles table to allow admins to manage
CREATE POLICY "Allow admins to manage user roles" ON user_roles
  FOR ALL USING (is_admin());

-- Add RLS policies for roles table to allow admins to read
CREATE POLICY "Allow admins to read roles" ON roles
  FOR SELECT USING (is_admin());

-- Note: These functions require the user to have admin role to execute
-- The is_admin() function from supabase-roles-schema.sql is used to check permissions
