-- Fix for inventory_transactions table schema
-- This script updates the reference_id column from UUID to INTEGER

-- First, drop the existing foreign key constraint if it exists
ALTER TABLE inventory_transactions DROP CONSTRAINT IF EXISTS inventory_transactions_reference_id_fkey;

-- Update the column type from UUID to INTEGER
ALTER TABLE inventory_transactions ALTER COLUMN reference_id TYPE INTEGER USING reference_id::INTEGER;

-- Add a comment to clarify the column purpose
COMMENT ON COLUMN inventory_transactions.reference_id IS 'Links to expenses (INTEGER), purchases, etc.';
