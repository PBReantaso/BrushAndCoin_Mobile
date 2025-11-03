-- Add token_version column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS token_version INTEGER DEFAULT 0;