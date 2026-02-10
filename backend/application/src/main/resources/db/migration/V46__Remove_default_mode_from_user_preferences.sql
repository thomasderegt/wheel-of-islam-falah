-- =====================================================
-- Flyway Migration V46: Remove default_mode from user_preferences
-- =====================================================
-- Removes default_mode column from user_preferences table
-- Mode is no longer used - always SUCCESS
-- Schema: users
-- =====================================================

-- Set search path to users schema
SET search_path TO users;

-- Drop check constraint for default_mode
ALTER TABLE users.user_preferences
DROP CONSTRAINT IF EXISTS chk_default_mode;

-- Drop default_mode column
ALTER TABLE users.user_preferences
DROP COLUMN IF EXISTS default_mode;

-- Reset search path
RESET search_path;
