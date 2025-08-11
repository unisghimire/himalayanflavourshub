-- Landing Page Content Schema
-- This table stores all the content for the landing page sections

CREATE TABLE IF NOT EXISTS landing_page_content (
  id SERIAL PRIMARY KEY,
  section_name VARCHAR(100) NOT NULL UNIQUE,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE landing_page_content ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON landing_page_content
  FOR SELECT USING (true);

-- Create policy to allow authenticated users to update content
CREATE POLICY "Allow authenticated users to update content" ON landing_page_content
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Insert initial content for Hero section
INSERT INTO landing_page_content (section_name, content) VALUES (
  'hero',
  '{
    "title": "From Top of the World",
    "subtitle": "Discover authentic Himalayan spices and flavors, carefully sourced from the pristine mountains and brought to your table with traditional wisdom and modern care.",
    "primaryButtonText": "Our Story",
    "secondaryButtonText": "Explore Products",
    "primaryButtonLink": "#story",
    "secondaryButtonLink": "#products"
  }'
) ON CONFLICT (section_name) DO NOTHING;

-- Insert initial content for Story section
INSERT INTO landing_page_content (section_name, content) VALUES (
  'story',
  '{
    "title": "Our Story",
    "subtitle": "A journey from the pristine Himalayas to your kitchen, bringing authentic flavors and traditional wisdom passed down through generations.",
    "chapters": [
      {
        "number": "01",
        "title": "The Sacred Mountains",
        "content": "High in the majestic Himalayas, where the air is pure and the soil is rich with minerals, our story begins. These sacred mountains have been home to ancient spice routes and traditional farming practices for centuries. The unique altitude, climate, and soil composition create the perfect conditions for growing the most aromatic and flavorful spices in the world.",
        "icon": "🏔️"
      },
      {
        "number": "02",
        "title": "Traditional Wisdom",
        "content": "Our spices are harvested using time-honored methods passed down through generations. Local farmers, with their deep understanding of the land and seasons, carefully select and hand-pick each spice at the perfect moment of ripeness. The traditional mortar and pestle method ensures that the natural oils and flavors are preserved, creating the most authentic taste experience.",
        "icon": "🌿"
      },
      {
        "number": "03",
        "title": "From Mountains to Your Table",
        "content": "Every spice in our collection embarks on a carefully orchestrated journey from the Himalayan heights to your kitchen. We maintain the highest standards of quality control, ensuring that each batch preserves its natural aroma, flavor, and nutritional value. Our commitment to authenticity means you experience the true taste of the Himalayas in every dish you create.",
        "icon": "🚚"
      }
    ]
  }'
) ON CONFLICT (section_name) DO NOTHING;

-- Insert initial content for Products section
INSERT INTO landing_page_content (section_name, content) VALUES (
  'products',
  '{
    "title": "Our Products",
    "subtitle": "Each product tells a story of tradition, quality, and the pristine Himalayan environment. Discover flavors that have been cherished for generations.",
    "categories": [
      { "id": "all", "name": "All Products" },
      { "id": "spices", "name": "Pure Spices" },
      { "id": "blends", "name": "Signature Blends" },
      { "id": "herbs", "name": "Fresh Herbs" }
    ],
    "products": [
      {
        "id": 1,
        "name": "Himalayan Black Pepper",
        "category": "spices",
        "description": "Premium black pepper from the high-altitude regions, known for its intense aroma and bold flavor.",
        "price": "$12.99",
        "image": "",
        "icon": "🌶️",
        "story": "Harvested from ancient pepper vines that grow wild in the Himalayan foothills, this black pepper carries the essence of the mountains."
      },
      {
        "id": 2,
        "name": "Sacred Cinnamon",
        "category": "spices",
        "description": "Rare cinnamon bark from the sacred groves, with a sweet and warming aroma.",
        "price": "$18.99",
        "image": "",
        "icon": "🌿",
        "story": "This cinnamon comes from trees that have been growing for generations in protected groves, where they are harvested with traditional reverence."
      },
      {
        "id": 3,
        "name": "Mountain Garam Masala",
        "category": "blends",
        "description": "Our signature blend of 12 aromatic spices, perfect for authentic Indian cuisine.",
        "price": "$24.99",
        "image": "",
        "icon": "✨",
        "story": "This blend represents centuries of culinary wisdom, combining spices that complement each other in perfect harmony."
      },
      {
        "id": 4,
        "name": "Wild Himalayan Thyme",
        "category": "herbs",
        "description": "Wild-harvested thyme with intense flavor and medicinal properties.",
        "price": "$15.99",
        "image": "",
        "icon": "🌱",
        "story": "Collected from wild thyme that grows naturally in the alpine meadows, this herb carries the pure essence of the mountains."
      },
      {
        "id": 5,
        "name": "Golden Turmeric",
        "category": "spices",
        "description": "Pure turmeric root powder with exceptional color and anti-inflammatory properties.",
        "price": "$14.99",
        "image": "",
        "icon": "🟡",
        "story": "This turmeric is grown in the rich, mineral-dense soil of the Himalayas, giving it a deeper color and more potent properties."
      },
      {
        "id": 6,
        "name": "Spice Route Blend",
        "category": "blends",
        "description": "A tribute to the ancient spice routes, featuring rare spices from across the region.",
        "price": "$29.99",
        "image": "",
        "icon": "🗺️",
        "story": "This blend recreates the flavors that traveled along the ancient spice routes, bringing together the best spices from across the Himalayan region."
      }
    ],
    "cta": {
      "title": "Experience the True Taste of the Himalayas",
      "subtitle": "Join thousands of customers who have discovered the authentic flavors of our region.",
      "primaryButtonText": "Contact Us",
      "secondaryButtonText": "Learn More",
      "primaryButtonLink": "#contact",
      "secondaryButtonLink": "#story"
    }
  }'
) ON CONFLICT (section_name) DO NOTHING;

-- Insert footer section content
INSERT INTO landing_page_content (section_name, content) VALUES (
  'footer',
  '{
    "branding": {
      "title": "HIMALAYAN FLAVOURS HUB",
      "subtitle": "From Top of the World",
      "description": "Bringing authentic Himalayan spices and flavors to your kitchen, preserving traditional wisdom and quality for generations to come."
    },
    "quickLinks": [
      { "text": "Our Story", "url": "#story" },
      { "text": "Products", "url": "#products" },
      { "text": "Contact", "url": "#contact" },
      { "text": "About Us", "url": "#about" }
    ],
    "contactInfo": [
      { "type": "address", "icon": "📍", "content": "Himalayan Region, India" },
      { "type": "email", "icon": "📧", "content": "info@himalayanflavours.com" },
      { "type": "phone", "icon": "📞", "content": "+91 98765 43210" }
    ],
    "socialLinks": [
      { "platform": "facebook", "icon": "📘", "url": "#" },
      { "platform": "instagram", "icon": "📷", "url": "#" },
      { "platform": "twitter", "icon": "🐦", "url": "#" },
      { "platform": "linkedin", "icon": "💼", "url": "#" }
    ],
    "bottom": {
      "copyright": "© 2025 Himalayan Flavours Hub. All rights reserved.",
      "legalLinks": [
        { "text": "Privacy Policy", "url": "#" },
        { "text": "Terms of Service", "url": "#" },
        { "text": "Shipping Info", "url": "#" }
      ]
    }
  }'
) ON CONFLICT (section_name) DO NOTHING;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_landing_page_content_updated_at 
    BEFORE UPDATE ON landing_page_content 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
