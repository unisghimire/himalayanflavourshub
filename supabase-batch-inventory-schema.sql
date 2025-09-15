-- Batch Inventory Consumption Schema
-- This tracks which inventory items are consumed in each production batch

-- Batch Inventory Consumption Table
CREATE TABLE IF NOT EXISTS batch_inventory_consumption (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id INTEGER NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  inventory_item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  quantity_consumed DECIMAL(10,3) NOT NULL,
  unit_cost DECIMAL(10,2) NOT NULL, -- Cost at time of consumption
  total_cost DECIMAL(10,2) NOT NULL, -- quantity_consumed * unit_cost
  consumption_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique combination of batch and inventory item
  UNIQUE(batch_id, inventory_item_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_batch_inventory_consumption_batch_id 
  ON batch_inventory_consumption(batch_id);
CREATE INDEX IF NOT EXISTS idx_batch_inventory_consumption_inventory_item_id 
  ON batch_inventory_consumption(inventory_item_id);
CREATE INDEX IF NOT EXISTS idx_batch_inventory_consumption_date 
  ON batch_inventory_consumption(consumption_date);

-- Enable RLS
ALTER TABLE batch_inventory_consumption ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Allow authenticated users to manage batch inventory consumption" 
  ON batch_inventory_consumption
  FOR ALL USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT ALL ON batch_inventory_consumption TO authenticated;

-- Create view for batch inventory consumption with details
CREATE OR REPLACE VIEW batch_inventory_details AS
SELECT 
  bic.id,
  bic.batch_id,
  b.batch_name,
  b.batch_number,
  b.production_date,
  bic.inventory_item_id,
  ii.name as inventory_item_name,
  ii.unit as inventory_unit,
  bic.quantity_consumed,
  bic.unit_cost,
  bic.total_cost,
  bic.consumption_date,
  bic.notes,
  ic.name as category_name
FROM batch_inventory_consumption bic
JOIN batches b ON bic.batch_id = b.id
JOIN inventory_items ii ON bic.inventory_item_id = ii.id
LEFT JOIN inventory_categories ic ON ii.category_id = ic.id
ORDER BY b.production_date DESC, bic.consumption_date DESC;

-- Grant permissions on view
GRANT SELECT ON batch_inventory_details TO authenticated;

-- Create view for batch cost summary
CREATE OR REPLACE VIEW batch_cost_summary AS
SELECT 
  b.id as batch_id,
  b.batch_name,
  b.batch_number,
  b.production_date,
  COALESCE(inventory_costs.total_inventory_cost, 0) as total_inventory_cost,
  COALESCE(expense_costs.total_expense_cost, 0) as total_expense_cost,
  COALESCE(inventory_costs.total_inventory_cost, 0) + COALESCE(expense_costs.total_expense_cost, 0) as total_production_cost,
  COALESCE(income_data.total_income, 0) as total_income,
  COALESCE(income_data.total_income, 0) - (COALESCE(inventory_costs.total_inventory_cost, 0) + COALESCE(expense_costs.total_expense_cost, 0)) as net_profit
FROM batches b
LEFT JOIN (
  SELECT 
    batch_id,
    SUM(total_cost) as total_inventory_cost
  FROM batch_inventory_consumption
  GROUP BY batch_id
) inventory_costs ON b.id = inventory_costs.batch_id
LEFT JOIN (
  SELECT 
    batch_id,
    SUM(amount) as total_expense_cost
  FROM expenses
  WHERE batch_id IS NOT NULL
  GROUP BY batch_id
) expense_costs ON b.id = expense_costs.batch_id
LEFT JOIN (
  SELECT 
    batch_id,
    SUM(amount) as total_income
  FROM income
  WHERE batch_id IS NOT NULL
  GROUP BY batch_id
) income_data ON b.id = income_data.batch_id
ORDER BY b.production_date DESC;

-- Grant permissions on view
GRANT SELECT ON batch_cost_summary TO authenticated;

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_batch_inventory_consumption_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_batch_inventory_consumption_updated_at
  BEFORE UPDATE ON batch_inventory_consumption
  FOR EACH ROW
  EXECUTE FUNCTION update_batch_inventory_consumption_updated_at();
