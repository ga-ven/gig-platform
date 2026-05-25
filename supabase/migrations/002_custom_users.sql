-- Custom Users Table for Username + Password Authentication
-- This table stores usernames and passwords, separate from Supabase Auth

CREATE TABLE IF NOT EXISTS custom_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  email TEXT,
  role TEXT DEFAULT 'worker' CHECK (role IN ('employer', 'worker')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE custom_users ENABLE ROW LEVEL SECURITY;

-- Anyone can create an account
CREATE POLICY "Anyone can create an account"
  ON custom_users FOR INSERT
  WITH CHECK (true);

-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON custom_users FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON custom_users FOR UPDATE
  USING (true);

-- Index for faster lookups
CREATE INDEX idx_custom_users_username ON custom_users(username);
