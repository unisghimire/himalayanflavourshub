-- Migration to add invoiced_quantity field to inventory_items table
-- This tracks how much inventory has been invoiced/accounted for separately from physical stock

-- Add the invoiced_quantity column
ALTER TABLE inventory_items ADD COLUMN invoiced_quantity DECIMAL(10,3) DEFAULT 0;

-- Add a comment to clarify the column purpose
COMMENT ON COLUMN inventory_items.invoiced_quantity IS 'Quantity that has been invoiced/accounted for (separate from physical current_stock)';

-- Drop the existing view first to avoid column name conflicts
DROP VIEW IF EXISTS inventory_stock_levels;

-- Create the updated inventory_stock_levels view with invoiced quantities
CREATE VIEW inventory_stock_levels AS
SELECT 
  i.id,
  i.name,
  i.description,
  i.sku,
  i.unit,
  i.current_stock,
  i.invoiced_quantity,
  (i.current_stock - i.invoiced_quantity) as available_for_invoice,
  i.minimum_stock,
  i.maximum_stock,
  i.unit_cost,
  i.supplier_name,
  i.storage_location,
  i.expiry_date,
  i.is_active,
  ic.name as category_name,
  CASE 
    WHEN i.expiry_date IS NOT NULL 
    THEN (i.expiry_date - CURRENT_DATE)::INTEGER
    ELSE NULL 
  END as days_until_expiry,
  CASE 
    WHEN i.current_stock <= i.minimum_stock THEN 'low'
    WHEN i.current_stock >= i.maximum_stock THEN 'high'
    WHEN i.expiry_date IS NOT NULL AND i.expiry_date <= CURRENT_DATE + INTERVAL '7 days' THEN 'expiring_soon'
    WHEN i.expiry_date IS NOT NULL AND i.expiry_date <= CURRENT_DATE THEN 'expired'
    ELSE 'normal'
  END as status
FROM inventory_items i
LEFT JOIN inventory_categories ic ON i.category_id = ic.id
WHERE i.is_active = true
ORDER BY i.name;
