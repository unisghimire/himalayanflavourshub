-- Update Users Functions with Correct Types
-- Run this script in your Supabase SQL editor to fix the type mismatch errors

-- First, drop the existing functions if they exist
DROP FUNCTION IF EXISTS get_all_users_with_roles();
DROP FUNCTION IF EXISTS assign_role_to_user(UUID, VARCHAR(255));
DROP FUNCTION IF EXISTS remove_role_from_user(UUID, VARCHAR(255));
DROP FUNCTION IF EXISTS get_user_roles_detailed(UUID);

-- Now run the updated functions from supabase-users-function.sql
-- The functions now use VARCHAR(255) instead of TEXT to match Supabase's expected types

-- After running this, the "structure of query does not match function result type" error should be resolved
