-- Supabase Storage Setup for Himalayan Flavours Hub
-- Run this SQL in your Supabase SQL Editor

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for category images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('category-images', 'category-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery-images', 'gallery-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up Row Level Security (RLS) policies for storage

-- Policy for product-images bucket
CREATE POLICY "Public read access for product images" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update product images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete product images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- Policy for category-images bucket
CREATE POLICY "Public read access for category images" ON storage.objects
FOR SELECT USING (bucket_id = 'category-images');

CREATE POLICY "Authenticated users can upload category images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'category-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update category images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'category-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete category images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'category-images' 
  AND auth.role() = 'authenticated'
);

-- Policy for gallery-images bucket
CREATE POLICY "Public read access for gallery images" ON storage.objects
FOR SELECT USING (bucket_id = 'gallery-images');

CREATE POLICY "Authenticated users can upload gallery images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'gallery-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can update gallery images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'gallery-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete gallery images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'gallery-images' 
  AND auth.role() = 'authenticated'
);

-- Create a function to generate unique file names
CREATE OR REPLACE FUNCTION generate_unique_filename()
RETURNS TEXT AS $$
BEGIN
  RETURN 'product_' || extract(epoch from now())::text || '_' || substr(md5(random()::text), 1, 8);
END;
$$ LANGUAGE plpgsql;

-- Create a function to get public URL for uploaded files
CREATE OR REPLACE FUNCTION get_public_url(bucket_name TEXT, file_path TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN 'https://' || current_setting('app.settings.supabase_url') || '/storage/v1/object/public/' || bucket_name || '/' || file_path;
END;
$$ LANGUAGE plpgsql;
