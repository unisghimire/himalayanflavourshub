-- Categories and Collections Database Schema for Himalayan Flavours Hub
-- Run this SQL in your Supabase SQL Editor

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(500),
    background_gradient VARCHAR(200), -- CSS gradient classes like "from-green-300 to-emerald-200"
    icon VARCHAR(50), -- Emoji or icon name
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create collections table
CREATE TABLE IF NOT EXISTS collections (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    category_id BIGINT REFERENCES categories(id) ON DELETE CASCADE,
    image_url VARCHAR(500),
    background_gradient VARCHAR(200),
    icon VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    short_description VARCHAR(300),
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    discount_percentage INTEGER DEFAULT 0,
    category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    collection_id BIGINT REFERENCES collections(id) ON DELETE SET NULL,
    image_url VARCHAR(500),
    gallery_images TEXT[], -- Array of image URLs
    weight_grams INTEGER,
    stock_quantity INTEGER DEFAULT 0,
    sku VARCHAR(100) UNIQUE,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_trending BOOLEAN DEFAULT false,
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    tags TEXT[], -- Array of tags
    certifications TEXT[], -- Array of certifications like ["Organic", "Fair Trade"]
    origin VARCHAR(100), -- Country/region of origin
    harvest_season VARCHAR(100),
    storage_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_sort ON categories(sort_order);

CREATE INDEX IF NOT EXISTS idx_collections_slug ON collections(slug);
CREATE INDEX IF NOT EXISTS idx_collections_category ON collections(category_id);
CREATE INDEX IF NOT EXISTS idx_collections_active ON collections(is_active);
CREATE INDEX IF NOT EXISTS idx_collections_featured ON collections(is_featured);
CREATE INDEX IF NOT EXISTS idx_collections_sort ON collections(sort_order);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_collection ON products(collection_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_trending ON products(is_trending);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read categories" ON categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read collections" ON collections
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read products" ON products
    FOR SELECT USING (is_active = true);

-- Create policies for admin access (authenticated users)
CREATE POLICY "Allow admin full access categories" ON categories
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin full access collections" ON collections
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin full access products" ON products
    FOR ALL USING (auth.role() = 'authenticated');

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON categories 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collections_updated_at 
    BEFORE UPDATE ON collections 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample categories
INSERT INTO categories (name, slug, description, image_url, background_gradient, icon, sort_order) VALUES
('Spices', 'spices', 'Premium Himalayan spices sourced from high-altitude regions', '/images/categories/spices.jpg', 'from-green-300 to-emerald-200', '🌶️', 1),
('Herbs', 'herbs', 'Fresh and dried herbs from mountain gardens', '/images/categories/herbs.jpg', 'from-green-400 to-teal-300', '🌿', 2),
('Teas', 'teas', 'High-altitude tea blends and varieties', '/images/categories/teas.jpg', 'from-orange-300 to-yellow-200', '🍵', 3),
('Essential Oils', 'essential-oils', 'Pure therapeutic essential oils', '/images/categories/oils.jpg', 'from-purple-300 to-pink-200', '💧', 4),
('Salts', 'salts', 'Natural Himalayan salt varieties', '/images/categories/salts.jpg', 'from-pink-300 to-rose-200', '🧂', 5),
('Blends', 'blends', 'Curated spice and herb blends', '/images/categories/blends.jpg', 'from-amber-300 to-orange-200', '✨', 6)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample collections
INSERT INTO collections (name, slug, description, category_id, image_url, background_gradient, icon, sort_order, is_featured) VALUES
('Mountain Harvest', 'mountain-harvest', 'Fresh spices from high-altitude regions', 1, '/images/collections/mountain-harvest.jpg', 'from-green-300 to-emerald-200', '🏔️', 1, true),
('Wild Herbs', 'wild-herbs', 'Wild-crafted herbs from pristine mountains', 2, '/images/collections/wild-herbs.jpg', 'from-green-400 to-teal-300', '🌿', 1, true),
('Tea Gardens', 'tea-gardens', 'Premium tea from mountain gardens', 3, '/images/collections/tea-gardens.jpg', 'from-orange-300 to-yellow-200', '🍵', 1, true),
('Aromatherapy', 'aromatherapy', 'Therapeutic essential oils', 4, '/images/collections/aromatherapy.jpg', 'from-purple-300 to-pink-200', '💧', 1, true),
('Pink Salt', 'pink-salt', 'Pure Himalayan pink salt', 5, '/images/collections/pink-salt.jpg', 'from-pink-300 to-rose-200', '🧂', 1, true),
('Chef Blends', 'chef-blends', 'Professional spice blends', 6, '/images/collections/chef-blends.jpg', 'from-amber-300 to-orange-200', '✨', 1, true)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, slug, description, short_description, price, original_price, discount_percentage, category_id, collection_id, image_url, weight_grams, stock_quantity, sku, is_featured, is_trending, rating, review_count, tags, certifications, origin) VALUES
('Wild Himalayan Thyme', 'wild-himalayan-thyme', 'Premium wild-crafted thyme from high-altitude regions', 'Aromatic thyme with intense flavor', 16.99, 19.99, 15, 2, 2, '/images/products/herbs/himalayan-thyme.jpg', 50, 100, 'THYME-001', true, true, 4.8, 45, ARRAY['wild-crafted', 'premium', 'aromatic'], ARRAY['Organic', 'Wild Harvested'], 'Himalayan Mountains'),
('Black Pepper Premium', 'black-pepper-premium', 'Premium black pepper with intense flavor', 'Rich and aromatic black pepper', 12.99, NULL, 0, 1, 1, '/images/products/spices/black-pepper.jpg', 100, 150, 'PEPPER-001', true, false, 4.6, 32, ARRAY['premium', 'intense'], ARRAY['Organic'], 'Malabar Coast'),
('Green Cardamom', 'green-cardamom', 'Fresh green cardamom pods', 'Aromatic and sweet cardamom', 18.99, 22.99, 17, 1, 1, '/images/products/spices/green-cardamom.jpg', 50, 80, 'CARDAMOM-001', true, true, 4.9, 67, ARRAY['aromatic', 'sweet', 'premium'], ARRAY['Organic', 'Fair Trade'], 'Kerala'),
('Himalayan Pink Salt', 'himalayan-pink-salt', 'Pure pink salt from ancient rock formations', 'Mineral-rich pink salt', 8.99, NULL, 0, 5, 5, '/images/products/salts/pink-salt.jpg', 500, 200, 'SALT-001', true, false, 4.7, 89, ARRAY['mineral-rich', 'pure'], ARRAY['Natural'], 'Himalayan Mountains'),
('Mountain Tea Blend', 'mountain-tea-blend', 'Herbal tea blend from mountain herbs', 'Soothing mountain tea blend', 14.99, 17.99, 17, 3, 3, '/images/products/teas/mountain-blend.jpg', 100, 120, 'TEA-001', true, true, 4.8, 56, ARRAY['herbal', 'soothing'], ARRAY['Organic'], 'Himalayan Mountains'),
('Lavender Essential Oil', 'lavender-essential-oil', 'Pure lavender essential oil', 'Calming lavender oil', 24.99, NULL, 0, 4, 4, '/images/products/oils/lavender.jpg', 30, 75, 'OIL-001', true, false, 4.9, 43, ARRAY['calming', 'pure'], ARRAY['Organic', 'Therapeutic Grade'], 'Provence')
ON CONFLICT (slug) DO NOTHING;

-- Create views for easier querying
CREATE OR REPLACE VIEW featured_products AS
SELECT p.*, c.name as category_name, c.slug as category_slug
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.is_featured = true AND p.is_active = true
ORDER BY p.sort_order, p.created_at DESC;

CREATE OR REPLACE VIEW trending_products AS
SELECT p.*, c.name as category_name, c.slug as category_slug
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.is_trending = true AND p.is_active = true
ORDER BY p.rating DESC, p.review_count DESC;

CREATE OR REPLACE VIEW category_products AS
SELECT 
    c.id as category_id,
    c.name as category_name,
    c.slug as category_slug,
    c.description as category_description,
    c.image_url as category_image,
    c.background_gradient,
    c.icon as category_icon,
    COUNT(p.id) as product_count,
    AVG(p.rating) as avg_rating
FROM categories c
LEFT JOIN products p ON c.id = p.category_id AND p.is_active = true
WHERE c.is_active = true
GROUP BY c.id, c.name, c.slug, c.description, c.image_url, c.background_gradient, c.icon
ORDER BY c.sort_order;

-- Grant permissions
GRANT ALL ON categories TO anon;
GRANT ALL ON collections TO anon;
GRANT ALL ON products TO anon;
GRANT ALL ON featured_products TO anon;
GRANT ALL ON trending_products TO anon;
GRANT ALL ON category_products TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
