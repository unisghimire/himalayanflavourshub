-- Reset inventory test data
-- This script will help you test the inventory system properly

-- First, let's see what's currently in the inventory_items table
SELECT id, name, current_stock, invoiced_quantity, (current_stock - invoiced_quantity) as available_for_invoice 
FROM inventory_items 
WHERE name ILIKE '%tomato%';

-- If you want to reset the tomato inventory to test properly:
-- UPDATE inventory_items 
-- SET current_stock = 20, invoiced_quantity = 0 
-- WHERE name ILIKE '%tomato%';

-- Check inventory transactions for tomato
SELECT 
  it.transaction_type,
  it.quantity,
  it.unit_cost,
  it.reference_type,
  it.notes,
  it.created_at
FROM inventory_transactions it
JOIN inventory_items ii ON it.item_id = ii.id
WHERE ii.name ILIKE '%tomato%'
ORDER BY it.created_at DESC;

-- Check expenses that reference tomato
SELECT 
  e.id,
  e.description,
  e.amount,
  e.quantity,
  e.unit,
  e.created_at
FROM expenses e
WHERE e.description ILIKE '%tomato%'
ORDER BY e.created_at DESC;
