-- Safe fix for inventory_transactions table schema
-- This script safely converts reference_id from UUID to INTEGER

-- Step 1: Create a new column with INTEGER type
ALTER TABLE inventory_transactions ADD COLUMN reference_id_new INTEGER;

-- Step 2: Copy any valid integer values from the old column
-- (This will only copy values that are actually integers, not UUIDs)
UPDATE inventory_transactions 
SET reference_id_new = CASE 
  WHEN reference_id::text ~ '^[0-9]+$' THEN reference_id::text::INTEGER 
  ELSE NULL 
END;

-- Step 3: Drop the old UUID column
ALTER TABLE inventory_transactions DROP COLUMN reference_id;

-- Step 4: Rename the new column to the original name
ALTER TABLE inventory_transactions RENAME COLUMN reference_id_new TO reference_id;

-- Step 5: Add a comment to clarify the column purpose
COMMENT ON COLUMN inventory_transactions.reference_id IS 'Links to expenses (INTEGER), purchases, etc.';

-- Step 6: Verify the change worked
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'inventory_transactions' 
AND column_name = 'reference_id';
