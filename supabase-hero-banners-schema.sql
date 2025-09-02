-- Hero Banners Table Schema for Himalayan Flavours Hub
-- Run this SQL in your Supabase SQL Editor

-- Create hero_banners table
CREATE TABLE IF NOT EXISTS hero_banners (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_hero_banners_order ON hero_banners(order_index);
CREATE INDEX IF NOT EXISTS idx_hero_banners_active ON hero_banners(is_active);

-- Enable Row Level Security
ALTER TABLE hero_banners ENABLE ROW LEVEL SECURITY;

-- Create policies for hero_banners table
-- Public read access for active banners
CREATE POLICY "Public read access for active hero banners" ON hero_banners
FOR SELECT USING (is_active = true);

-- Authenticated users can manage banners
CREATE POLICY "Authenticated users can insert hero banners" ON hero_banners
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update hero banners" ON hero_banners
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete hero banners" ON hero_banners
FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_hero_banners_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_hero_banners_updated_at
  BEFORE UPDATE ON hero_banners
  FOR EACH ROW
  EXECUTE FUNCTION update_hero_banners_updated_at();

-- Insert some default hero banners (optional - can be removed if not needed)
-- INSERT INTO hero_banners (title, subtitle, image_url, order_index) VALUES
-- ('Himalayan Spices', 'Pure & Authentic', '/images/hero/himalayan-spices.jpg', 0),
-- ('Mountain Harvest', 'Fresh from Nature', '/images/hero/mountain-harvest.jpg', 1),
-- ('Traditional Methods', 'Centuries Old Wisdom', '/images/hero/traditional-methods.jpg', 2);
