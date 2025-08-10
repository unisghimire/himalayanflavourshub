-- Supabase Database Schema for Himalayan Flavours Hub
-- Run this SQL in your Supabase SQL Editor

-- Create the emails table
CREATE TABLE IF NOT EXISTS emails (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    ip_address VARCHAR(45), -- IPv6 can be up to 45 characters
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_emails_email ON emails(email);

-- Create an index on created_at for faster date-based queries
CREATE INDEX IF NOT EXISTS idx_emails_created_at ON emails(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert emails (for the email collection form)
CREATE POLICY "Allow public email insertion" ON emails
    FOR INSERT WITH CHECK (true);

-- Create a policy that allows reading emails (for the admin panel)
-- In production, you might want to restrict this to authenticated users only
CREATE POLICY "Allow public email reading" ON emails
    FOR SELECT USING (true);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at
CREATE TRIGGER update_emails_updated_at 
    BEFORE UPDATE ON emails 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create a view for email statistics
CREATE OR REPLACE VIEW email_stats AS
SELECT 
    COUNT(*) as total_emails,
    COUNT(DISTINCT email) as unique_emails,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as today_emails,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as week_emails,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as month_emails
FROM emails;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON emails TO anon;
GRANT ALL ON email_stats TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
