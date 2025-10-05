-- Units Schema for Inventory Management
-- This schema handles different units of measurement for inventory items

-- Units Table
CREATE TABLE IF NOT EXISTS units (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  symbol VARCHAR(10) NOT NULL UNIQUE,
  description TEXT,
  category VARCHAR(50) DEFAULT 'general', -- weight, volume, count, length, etc.
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default units for inventory management
INSERT INTO units (name, symbol, description, category) VALUES
-- Weight units
('Kilogram', 'kg', 'Kilogram - standard weight unit', 'weight'),
('Gram', 'g', 'Gram - smaller weight unit', 'weight'),
('Pound', 'lb', 'Pound - imperial weight unit', 'weight'),
('Ounce', 'oz', 'Ounce - imperial weight unit', 'weight'),

-- Volume units
('Liter', 'L', 'Liter - standard volume unit', 'volume'),
('Milliliter', 'ml', 'Milliliter - smaller volume unit', 'volume'),
('Gallon', 'gal', 'Gallon - imperial volume unit', 'volume'),
('Pint', 'pt', 'Pint - imperial volume unit', 'volume'),

-- Count units
('Piece', 'pcs', 'Piece - individual items', 'count'),
('Dozen', 'doz', 'Dozen - 12 pieces', 'count'),
('Box', 'box', 'Box - packaged items', 'count'),
('Pack', 'pack', 'Pack - packaged items', 'count'),
('Bundle', 'bundle', 'Bundle - tied together items', 'count'),

-- Length units
('Meter', 'm', 'Meter - standard length unit', 'length'),
('Centimeter', 'cm', 'Centimeter - smaller length unit', 'length'),
('Inch', 'in', 'Inch - imperial length unit', 'length'),
('Foot', 'ft', 'Foot - imperial length unit', 'length'),

-- Area units
('Square Meter', 'm²', 'Square Meter - area unit', 'area'),
('Square Foot', 'ft²', 'Square Foot - imperial area unit', 'area'),

-- Time units
('Hour', 'hr', 'Hour - time unit', 'time'),
('Day', 'day', 'Day - time unit', 'time'),
('Week', 'week', 'Week - time unit', 'time'),
('Month', 'month', 'Month - time unit', 'time'),

-- Other common units
('Kilogram per Liter', 'kg/L', 'Density unit', 'density'),
('Percent', '%', 'Percentage', 'percentage'),
('Each', 'ea', 'Each - individual unit', 'count'),
('Set', 'set', 'Set - collection of items', 'count'),
('Pair', 'pair', 'Pair - two items', 'count'),
('Gross', 'gross', 'Gross - 144 pieces', 'count'),
('Ream', 'ream', 'Ream - 500 sheets', 'count')
ON CONFLICT (name) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE units ENABLE ROW LEVEL SECURITY;

-- RLS Policies for units
CREATE POLICY "Users can view units" ON units
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage units" ON units
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      JOIN roles r ON ur.role_id = r.id 
      WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    )
  );

-- Grant permissions
GRANT ALL ON units TO authenticated;
GRANT SELECT ON units TO authenticated;

-- Create trigger for updated_at
CREATE TRIGGER update_units_updated_at 
  BEFORE UPDATE ON units 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
