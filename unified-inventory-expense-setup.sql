-- Unified Inventory & Expense Setup
-- This script ensures the database is properly configured for the simplified interface

-- Ensure all necessary tables exist and have proper relationships
-- (These should already exist from previous schema files)

-- Create a view for unified inventory and expense data
CREATE OR REPLACE VIEW unified_inventory_expenses AS
SELECT 
  i.id as inventory_item_id,
  i.name as item_name,
  i.description as item_description,
  i.category_id,
  ic.name as category_name,
  i.sku,
  i.unit,
  i.current_stock,
  i.invoiced_quantity,
  (i.current_stock - i.invoiced_quantity) as available_for_invoice,
  i.minimum_stock,
  i.maximum_stock,
  i.unit_cost,
  i.supplier_name,
  i.supplier_contact,
  i.storage_location,
  i.expiry_date,
  i.is_active,
  CASE 
    WHEN i.current_stock <= i.minimum_stock THEN 'low'
    WHEN i.current_stock >= i.maximum_stock THEN 'high'
    ELSE 'normal'
  END as stock_status,
  -- Calculate days until expiry (if applicable)
  CASE 
    WHEN i.expiry_date IS NOT NULL THEN 
      (i.expiry_date - CURRENT_DATE)::INTEGER
    ELSE NULL
  END as days_until_expiry,
  -- Recent expense data
  COALESCE(recent_expenses.total_amount, 0) as recent_expense_amount,
  COALESCE(recent_expenses.expense_count, 0) as recent_expense_count,
  recent_expenses.last_expense_date
FROM inventory_items i
LEFT JOIN inventory_categories ic ON i.category_id = ic.id
LEFT JOIN (
  SELECT 
    -- Extract inventory_item_id from expense description
    CASE 
      WHEN e.description ~ 'inventory_item_id:([a-f0-9-]+)' THEN
        (regexp_match(e.description, 'inventory_item_id:([a-f0-9-]+)'))[1]::uuid
      ELSE NULL
    END as inventory_item_id,
    SUM(e.amount) as total_amount,
    COUNT(*) as expense_count,
    MAX(e.expense_date) as last_expense_date
  FROM expenses e
  WHERE e.description ~ 'inventory_item_id:'
  GROUP BY 
    CASE 
      WHEN e.description ~ 'inventory_item_id:([a-f0-9-]+)' THEN
        (regexp_match(e.description, 'inventory_item_id:([a-f0-9-]+)'))[1]::uuid
      ELSE NULL
    END
) recent_expenses ON i.id = recent_expenses.inventory_item_id
WHERE i.is_active = true;

-- Create a simplified summary view for the dashboard
CREATE OR REPLACE VIEW simplified_dashboard_summary AS
SELECT 
  -- Inventory summary
  COUNT(DISTINCT i.id) as total_items,
  COUNT(DISTINCT CASE WHEN i.current_stock <= i.minimum_stock THEN i.id END) as low_stock_count,
  COUNT(DISTINCT CASE WHEN i.expiry_date IS NOT NULL AND i.expiry_date <= CURRENT_DATE + INTERVAL '30 days' THEN i.id END) as expiry_count,
  COALESCE(SUM(i.current_stock * i.unit_cost), 0) as total_inventory_value,
  
  -- Expense summary
  COALESCE(SUM(e.amount), 0) as total_expenses,
  COUNT(DISTINCT e.id) as total_expense_entries,
  
  -- Low stock items
  ARRAY_AGG(
    CASE WHEN i.current_stock <= i.minimum_stock THEN
      json_build_object(
        'id', i.id,
        'name', i.name,
        'current_stock', i.current_stock,
        'minimum_stock', i.minimum_stock,
        'unit', i.unit,
        'shortage_quantity', (i.minimum_stock - i.current_stock)
      )
    END
  ) FILTER (WHERE i.current_stock <= i.minimum_stock) as low_stock_items,
  
  -- Expiry items
  ARRAY_AGG(
    CASE WHEN i.expiry_date IS NOT NULL AND i.expiry_date <= CURRENT_DATE + INTERVAL '30 days' THEN
      json_build_object(
        'id', i.id,
        'name', i.name,
        'current_stock', i.current_stock,
        'unit', i.unit,
        'expiry_date', i.expiry_date,
        'days_until_expiry', (i.expiry_date - CURRENT_DATE)::INTEGER
      )
    END
  ) FILTER (WHERE i.expiry_date IS NOT NULL AND i.expiry_date <= CURRENT_DATE + INTERVAL '30 days') as expiry_items

FROM inventory_items i
LEFT JOIN expenses e ON e.description ~ ('inventory_item_id:' || i.id::text)
WHERE i.is_active = true;

-- Grant permissions for the new views
GRANT SELECT ON unified_inventory_expenses TO authenticated;
GRANT SELECT ON simplified_dashboard_summary TO authenticated;

-- Create a function to get simplified dashboard data
CREATE OR REPLACE FUNCTION get_simplified_dashboard_data()
RETURNS TABLE (
  total_items BIGINT,
  low_stock_count BIGINT,
  expiry_count BIGINT,
  total_inventory_value NUMERIC,
  total_expenses NUMERIC,
  low_stock_items JSON,
  expiry_items JSON
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sds.total_items,
    sds.low_stock_count,
    sds.expiry_count,
    sds.total_inventory_value,
    sds.total_expenses,
    sds.low_stock_items,
    sds.expiry_items
  FROM simplified_dashboard_summary sds;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_simplified_dashboard_data() TO authenticated;

-- Create an index to improve performance for inventory item lookups in expenses
CREATE INDEX IF NOT EXISTS idx_expenses_inventory_lookup 
ON expenses USING gin (description gin_trgm_ops)
WHERE description ~ 'inventory_item_id:';

-- Create an index for inventory items by stock status
CREATE INDEX IF NOT EXISTS idx_inventory_items_stock_status 
ON inventory_items (current_stock, minimum_stock, is_active)
WHERE is_active = true;

-- Create an index for expiry date lookups
CREATE INDEX IF NOT EXISTS idx_inventory_items_expiry 
ON inventory_items (expiry_date, is_active)
WHERE is_active = true AND expiry_date IS NOT NULL;
