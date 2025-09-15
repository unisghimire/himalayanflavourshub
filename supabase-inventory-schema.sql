-- Inventory Management Schema for Himalayan Flavours Hub
-- This schema handles inventory items, stock levels, and transactions

-- Inventory Categories Table
CREATE TABLE inventory_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory Items Table
CREATE TABLE inventory_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  category_id UUID REFERENCES inventory_categories(id) ON DELETE SET NULL,
  sku VARCHAR(50) UNIQUE, -- Stock Keeping Unit
  unit VARCHAR(20) NOT NULL DEFAULT 'kg', -- kg, pieces, liters, etc.
  current_stock DECIMAL(10,3) DEFAULT 0,
  invoiced_quantity DECIMAL(10,3) DEFAULT 0, -- Quantity that has been invoiced/accounted for
  minimum_stock DECIMAL(10,3) DEFAULT 0, -- Alert when stock goes below this
  maximum_stock DECIMAL(10,3) DEFAULT 0, -- Maximum capacity
  unit_cost DECIMAL(10,2) DEFAULT 0, -- Current unit cost
  supplier_name VARCHAR(200),
  supplier_contact VARCHAR(100),
  storage_location VARCHAR(100), -- Where it's stored
  expiry_date DATE, -- For perishable items
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory Transactions Table (Stock In/Out)
CREATE TABLE inventory_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE,
  transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('in', 'out', 'adjustment')),
  quantity DECIMAL(10,3) NOT NULL,
  unit_cost DECIMAL(10,2) DEFAULT 0,
  total_cost DECIMAL(10,2) DEFAULT 0,
  reference_type VARCHAR(50), -- 'purchase', 'expense', 'production', 'waste', 'adjustment'
  reference_id INTEGER, -- Links to expenses, purchases, etc.
  batch_id INTEGER REFERENCES batches(id) ON DELETE SET NULL,
  notes TEXT,
  transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory Stock Levels View (Current stock for each item)
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
    WHEN i.current_stock <= i.minimum_stock THEN 'low'
    WHEN i.current_stock >= i.maximum_stock THEN 'high'
    ELSE 'normal'
  END as stock_status,
  -- Calculate days until expiry (if applicable)
  CASE 
    WHEN i.expiry_date IS NOT NULL THEN 
      (i.expiry_date - CURRENT_DATE)::INTEGER
    ELSE NULL
  END as days_until_expiry
FROM inventory_items i
LEFT JOIN inventory_categories ic ON i.category_id = ic.id
WHERE i.is_active = true;

-- Inventory Transaction Summary View
CREATE OR REPLACE VIEW inventory_transaction_summary AS
SELECT 
  it.id,
  it.transaction_type,
  it.quantity,
  it.unit_cost,
  it.total_cost,
  it.reference_type,
  it.transaction_date,
  it.notes,
  i.name as item_name,
  i.unit,
  ic.name as category_name,
  b.batch_number,
  b.batch_name
FROM inventory_transactions it
JOIN inventory_items i ON it.item_id = i.id
LEFT JOIN inventory_categories ic ON i.category_id = ic.id
LEFT JOIN batches b ON it.batch_id = b.id
ORDER BY it.transaction_date DESC;

-- Low Stock Alert View
CREATE OR REPLACE VIEW low_stock_alerts AS
SELECT 
  i.id,
  i.name,
  i.sku,
  i.unit,
  i.current_stock,
  i.minimum_stock,
  i.supplier_name,
  ic.name as category_name,
  (i.minimum_stock - i.current_stock) as shortage_quantity
FROM inventory_items i
LEFT JOIN inventory_categories ic ON i.category_id = ic.id
WHERE i.is_active = true 
  AND i.current_stock <= i.minimum_stock
  AND i.minimum_stock > 0
ORDER BY (i.minimum_stock - i.current_stock) DESC;

-- Expiry Alert View
CREATE OR REPLACE VIEW expiry_alerts AS
SELECT 
  i.id,
  i.name,
  i.sku,
  i.unit,
  i.current_stock,
  i.expiry_date,
  ic.name as category_name,
  (i.expiry_date - CURRENT_DATE)::INTEGER as days_until_expiry
FROM inventory_items i
LEFT JOIN inventory_categories ic ON i.category_id = ic.id
WHERE i.is_active = true 
  AND i.expiry_date IS NOT NULL
  AND i.current_stock > 0
  AND i.expiry_date <= CURRENT_DATE + INTERVAL '30 days'
ORDER BY i.expiry_date ASC;

-- Function to update stock levels after transaction
CREATE OR REPLACE FUNCTION update_inventory_stock()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Update current stock based on transaction
    IF NEW.transaction_type = 'in' THEN
      UPDATE inventory_items 
      SET current_stock = current_stock + NEW.quantity,
          unit_cost = NEW.unit_cost,
          updated_at = NOW()
      WHERE id = NEW.item_id;
    ELSIF NEW.transaction_type = 'out' THEN
      UPDATE inventory_items 
      SET current_stock = current_stock - NEW.quantity,
          updated_at = NOW()
      WHERE id = NEW.item_id;
    ELSIF NEW.transaction_type = 'adjustment' THEN
      -- For adjustment transactions, don't modify current_stock
      -- This is used for invoiced quantities and other adjustments
      -- that don't affect physical stock
      NULL;
    END IF;
    
    RETURN NEW;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update stock levels
CREATE TRIGGER inventory_stock_update_trigger
  AFTER INSERT ON inventory_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_inventory_stock();

-- Insert default inventory categories
INSERT INTO inventory_categories (name, description) VALUES
('Raw Materials', 'Fresh vegetables, fruits, and basic ingredients'),
('Spices & Seasonings', 'Spices, herbs, and flavoring agents'),
('Packaging Materials', 'Jars, lids, labels, and packaging supplies'),
('Preservatives', 'Salt, vinegar, and other preserving agents'),
('Oils & Fats', 'Cooking oils and fats used in production'),
('Other Supplies', 'Miscellaneous production supplies');

-- Enable Row Level Security
ALTER TABLE inventory_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for inventory_categories
CREATE POLICY "Users can view inventory categories" ON inventory_categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage inventory categories" ON inventory_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      JOIN roles r ON ur.role_id = r.id 
      WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    )
  );

-- RLS Policies for inventory_items
CREATE POLICY "Users can view inventory items" ON inventory_items
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage inventory items" ON inventory_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      JOIN roles r ON ur.role_id = r.id 
      WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    )
  );

-- RLS Policies for inventory_transactions
CREATE POLICY "Users can view inventory transactions" ON inventory_transactions
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage inventory transactions" ON inventory_transactions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      JOIN roles r ON ur.role_id = r.id 
      WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    )
  );

-- Grant permissions
GRANT ALL ON inventory_categories TO authenticated;
GRANT ALL ON inventory_items TO authenticated;
GRANT ALL ON inventory_transactions TO authenticated;
GRANT SELECT ON inventory_stock_levels TO authenticated;
GRANT SELECT ON inventory_transaction_summary TO authenticated;
GRANT SELECT ON low_stock_alerts TO authenticated;
GRANT SELECT ON expiry_alerts TO authenticated;
