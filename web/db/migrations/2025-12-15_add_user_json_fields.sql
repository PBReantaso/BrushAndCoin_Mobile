-- Migration: 2025-12-15_add_user_json_fields.sql
-- Adds JSONB fields to users table for gcash details and social links
-- Also adds optional last_seen timestamp for online status tracking

BEGIN;

-- Add JSONB columns if they do not already exist
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS gcash_details JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS last_seen TIMESTAMPTZ;

-- Optional: Add a GIN index to speed up queries filtering on JSONB
-- CREATE INDEX IF NOT EXISTS idx_users_gcash_details_gin ON users USING gin (gcash_details);
-- CREATE INDEX IF NOT EXISTS idx_users_social_links_gin ON users USING gin (social_links);

COMMIT;

-- Rollback (if you need to undo this migration):
-- BEGIN;
-- ALTER TABLE users
--   DROP COLUMN IF EXISTS gcash_details,
--   DROP COLUMN IF EXISTS social_links,
--   DROP COLUMN IF EXISTS last_seen;
-- COMMIT;