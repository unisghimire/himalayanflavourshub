-- Accounting System Schema for Pickle Business
-- This schema supports expense tracking, batch management, and profit analysis

-- Accounting Heads (Categories for expenses)
CREATE TABLE IF NOT EXISTS accounting_heads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  type VARCHAR(20) NOT NULL CHECK (type IN ('expense', 'income', 'asset', 'liability')),
  parent_id INTEGER REFERENCES accounting_heads(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Batches (Production batches for tracking costs)
CREATE TABLE IF NOT EXISTS batches (
  id SERIAL PRIMARY KEY,
  batch_number VARCHAR(50) NOT NULL UNIQUE,
  batch_name VARCHAR(100) NOT NULL,
  description TEXT,
  production_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  total_quantity INTEGER DEFAULT 0,
  unit VARCHAR(20) DEFAULT 'units',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products linked to batches
CREATE TABLE IF NOT EXISTS batch_products (
  id SERIAL PRIMARY KEY,
  batch_id INTEGER NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 0,
  unit_cost DECIMAL(10,2) DEFAULT 0,
  total_cost DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(batch_id, product_id)
);

-- Expense Categories (Detailed categories under accounting heads)
CREATE TABLE IF NOT EXISTS expense_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  accounting_head_id INTEGER NOT NULL REFERENCES accounting_heads(id) ON DELETE CASCADE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expenses (Individual expense entries)
CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  expense_number VARCHAR(50) NOT NULL UNIQUE,
  accounting_head_id INTEGER NOT NULL REFERENCES accounting_heads(id),
  expense_category_id INTEGER REFERENCES expense_categories(id),
  batch_id INTEGER REFERENCES batches(id),
  product_id INTEGER REFERENCES products(id),
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  quantity DECIMAL(10,2) DEFAULT 1,
  unit VARCHAR(20) DEFAULT 'units',
  unit_cost DECIMAL(10,2) GENERATED ALWAYS AS (amount / NULLIF(quantity, 0)) STORED,
  expense_date DATE NOT NULL,
  vendor_name VARCHAR(100),
  payment_method VARCHAR(50),
  reference_number VARCHAR(100),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Income (Sales and other income)
CREATE TABLE IF NOT EXISTS income (
  id SERIAL PRIMARY KEY,
  income_number VARCHAR(50) NOT NULL UNIQUE,
  accounting_head_id INTEGER NOT NULL REFERENCES accounting_heads(id),
  batch_id INTEGER REFERENCES batches(id),
  product_id INTEGER REFERENCES products(id),
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  quantity DECIMAL(10,2) DEFAULT 1,
  unit VARCHAR(20) DEFAULT 'units',
  unit_price DECIMAL(10,2) GENERATED ALWAYS AS (amount / NULLIF(quantity, 0)) STORED,
  income_date DATE NOT NULL,
  customer_name VARCHAR(100),
  payment_method VARCHAR(50),
  reference_number VARCHAR(100),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profit/Loss Analysis View
CREATE OR REPLACE VIEW profit_loss_analysis AS
SELECT 
  b.id as batch_id,
  b.batch_number,
  b.batch_name,
  b.production_date,
  COALESCE(expense_totals.total_expenses, 0) as total_expenses,
  COALESCE(income_totals.total_income, 0) as total_income,
  COALESCE(income_totals.total_income, 0) - COALESCE(expense_totals.total_expenses, 0) as net_profit,
  CASE 
    WHEN COALESCE(expense_totals.total_expenses, 0) > 0 
    THEN ROUND(((COALESCE(income_totals.total_income, 0) - COALESCE(expense_totals.total_expenses, 0)) / expense_totals.total_expenses) * 100, 2)
    ELSE 0 
  END as profit_margin_percentage
FROM batches b
LEFT JOIN (
  SELECT 
    batch_id,
    SUM(amount) as total_expenses
  FROM expenses 
  WHERE batch_id IS NOT NULL
  GROUP BY batch_id
) expense_totals ON b.id = expense_totals.batch_id
LEFT JOIN (
  SELECT 
    batch_id,
    SUM(amount) as total_income
  FROM income 
  WHERE batch_id IS NOT NULL
  GROUP BY batch_id
) income_totals ON b.id = income_totals.batch_id;

-- Accounting Head Summary View
CREATE OR REPLACE VIEW accounting_head_summary AS
SELECT 
  ah.id,
  ah.name as head_name,
  ah.type,
  COALESCE(expense_totals.total_expenses, 0) as total_expenses,
  COALESCE(income_totals.total_income, 0) as total_income,
  COALESCE(income_totals.total_income, 0) - COALESCE(expense_totals.total_expenses, 0) as net_amount
FROM accounting_heads ah
LEFT JOIN (
  SELECT 
    accounting_head_id,
    SUM(amount) as total_expenses
  FROM expenses 
  GROUP BY accounting_head_id
) expense_totals ON ah.id = expense_totals.accounting_head_id
LEFT JOIN (
  SELECT 
    accounting_head_id,
    SUM(amount) as total_income
  FROM income 
  GROUP BY accounting_head_id
) income_totals ON ah.id = income_totals.accounting_head_id;

-- Product-wise Cost Analysis View
CREATE OR REPLACE VIEW product_cost_analysis AS
SELECT 
  e.id as expense_id,
  e.description,
  e.amount,
  e.quantity,
  e.unit,
  e.expense_date,
  e.vendor_name,
  ah.name as accounting_head,
  ec.name as expense_category,
  b.batch_number,
  b.batch_name,
  p.name as product_name,
  p.slug as product_slug,
  -- Extract product name from description (format: "Product Name - Quantity Unit - Rs.Amount")
  CASE 
    WHEN e.description ~ '^[^-]+ - \d+\.?\d* [^-]+ - Rs\.\d+\.?\d*$' THEN
      SPLIT_PART(e.description, ' - ', 1)
    ELSE
      COALESCE(p.name, 'Unknown Product')
  END as extracted_product_name
FROM expenses e
LEFT JOIN accounting_heads ah ON e.accounting_head_id = ah.id
LEFT JOIN expense_categories ec ON e.expense_category_id = ec.id
LEFT JOIN batches b ON e.batch_id = b.id
LEFT JOIN products p ON e.product_id = p.id
WHERE ah.name = 'Raw Materials' OR ah.name = 'Packaging Materials';

-- Product Cost Summary View
CREATE OR REPLACE VIEW product_cost_summary AS
SELECT 
  extracted_product_name as product_name,
  accounting_head,
  expense_category,
  COUNT(*) as transaction_count,
  SUM(amount) as total_cost,
  SUM(quantity) as total_quantity,
  unit,
  AVG(amount / NULLIF(quantity, 0)) as avg_unit_cost,
  MIN(expense_date) as first_purchase_date,
  MAX(expense_date) as last_purchase_date
FROM product_cost_analysis
GROUP BY extracted_product_name, accounting_head, expense_category, unit
ORDER BY total_cost DESC;

-- Enable Row Level Security
ALTER TABLE accounting_heads ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE income ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to manage accounting heads" ON accounting_heads
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage batches" ON batches
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage batch products" ON batch_products
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage expense categories" ON expense_categories
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage expenses" ON expenses
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage income" ON income
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert default accounting heads for pickle business
INSERT INTO accounting_heads (name, description, type) VALUES 
  ('Raw Materials', 'Cost of raw materials used in production', 'expense'),
  ('Packaging Materials', 'Cost of packaging and containers', 'expense'),
  ('Labor Costs', 'Wages and salaries for production staff', 'expense'),
  ('Utilities', 'Electricity, water, gas costs', 'expense'),
  ('Transportation', 'Shipping and delivery costs', 'expense'),
  ('Marketing', 'Advertising and promotional expenses', 'expense'),
  ('Administrative', 'Office supplies and administrative costs', 'expense'),
  ('Sales Revenue', 'Revenue from product sales', 'income'),
  ('Other Income', 'Miscellaneous income sources', 'income')
ON CONFLICT (name) DO NOTHING;

-- Insert default expense categories
INSERT INTO expense_categories (name, accounting_head_id, description) VALUES 
  ('Vegetables', (SELECT id FROM accounting_heads WHERE name = 'Raw Materials'), 'Fresh vegetables for pickling'),
  ('Spices', (SELECT id FROM accounting_heads WHERE name = 'Raw Materials'), 'Spices and seasonings'),
  ('Oil', (SELECT id FROM accounting_heads WHERE name = 'Raw Materials'), 'Cooking oil and vinegar'),
  ('Jars & Lids', (SELECT id FROM accounting_heads WHERE name = 'Packaging Materials'), 'Glass jars and lids'),
  ('Labels', (SELECT id FROM accounting_heads WHERE name = 'Packaging Materials'), 'Product labels and stickers'),
  ('Boxes', (SELECT id FROM accounting_heads WHERE name = 'Packaging Materials'), 'Shipping boxes and packaging'),
  ('Production Staff', (SELECT id FROM accounting_heads WHERE name = 'Labor Costs'), 'Wages for production workers'),
  ('Packaging Staff', (SELECT id FROM accounting_heads WHERE name = 'Labor Costs'), 'Wages for packaging staff'),
  ('Electricity', (SELECT id FROM accounting_heads WHERE name = 'Utilities'), 'Electricity bills'),
  ('Water', (SELECT id FROM accounting_heads WHERE name = 'Utilities'), 'Water bills'),
  ('Gas', (SELECT id FROM accounting_heads WHERE name = 'Utilities'), 'Gas bills'),
  ('Local Delivery', (SELECT id FROM accounting_heads WHERE name = 'Transportation'), 'Local delivery costs'),
  ('Shipping', (SELECT id FROM accounting_heads WHERE name = 'Transportation'), 'Long-distance shipping'),
  ('Online Ads', (SELECT id FROM accounting_heads WHERE name = 'Marketing'), 'Online advertising costs'),
  ('Print Ads', (SELECT id FROM accounting_heads WHERE name = 'Marketing'), 'Print advertising costs'),
  ('Office Supplies', (SELECT id FROM accounting_heads WHERE name = 'Administrative'), 'Office and stationery supplies'),
  ('Phone & Internet', (SELECT id FROM accounting_heads WHERE name = 'Administrative'), 'Communication costs')
ON CONFLICT DO NOTHING;

-- Create triggers for updated_at
CREATE TRIGGER update_accounting_heads_updated_at 
  BEFORE UPDATE ON accounting_heads 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_batches_updated_at 
  BEFORE UPDATE ON batches 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expense_categories_updated_at 
  BEFORE UPDATE ON expense_categories 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at 
  BEFORE UPDATE ON expenses 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_income_updated_at 
  BEFORE UPDATE ON income 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON accounting_heads TO authenticated;
GRANT ALL ON batches TO authenticated;
GRANT ALL ON batch_products TO authenticated;
GRANT ALL ON expense_categories TO authenticated;
GRANT ALL ON expenses TO authenticated;
GRANT ALL ON income TO authenticated;
GRANT SELECT ON profit_loss_analysis TO authenticated;
GRANT SELECT ON accounting_head_summary TO authenticated;
GRANT SELECT ON product_cost_analysis TO authenticated;
GRANT SELECT ON product_cost_summary TO authenticated;
