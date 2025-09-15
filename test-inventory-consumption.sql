-- Test script to verify inventory consumption is working correctly
-- Run this in your Supabase SQL editor to test the trigger

-- First, let's see the current state of an inventory item
SELECT id, name, current_stock, invoiced_quantity 
FROM inventory_items 
WHERE name ILIKE '%oil%' 
ORDER BY created_at DESC 
LIMIT 1;

-- Let's also check if there are any recent transactions
SELECT 
  it.id,
  it.transaction_type,
  it.quantity,
  it.notes,
  it.created_at,
  ii.name as item_name
FROM inventory_transactions it
JOIN inventory_items ii ON it.item_id = ii.id
WHERE ii.name ILIKE '%oil%'
ORDER BY it.created_at DESC
LIMIT 5;

-- Test the trigger by manually inserting a transaction
-- (This simulates what happens when batch consumption is added)
INSERT INTO inventory_transactions (
  item_id,
  transaction_type,
  quantity,
  unit_cost,
  total_cost,
  reference_type,
  reference_id,
  batch_id,
  notes
) 
SELECT 
  id,
  'out',
  1.0, -- Test with 1 unit
  unit_cost,
  unit_cost * 1.0,
  'batch_production',
  1, -- Test batch ID
  1, -- Test batch ID
  'Test consumption - should reduce stock by 1'
FROM inventory_items 
WHERE name ILIKE '%oil%' 
ORDER BY created_at DESC 
LIMIT 1;

-- Check the inventory item again to see if stock was reduced
SELECT id, name, current_stock, invoiced_quantity 
FROM inventory_items 
WHERE name ILIKE '%oil%' 
ORDER BY created_at DESC 
LIMIT 1;

-- Check the transaction was created
SELECT 
  it.id,
  it.transaction_type,
  it.quantity,
  it.notes,
  it.created_at,
  ii.name as item_name
FROM inventory_transactions it
JOIN inventory_items ii ON it.item_id = ii.id
WHERE ii.name ILIKE '%oil%'
ORDER BY it.created_at DESC
LIMIT 3;
