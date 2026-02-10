-- =====================================================
-- Flyway Migration V45: Add default_goals_okr_context to user_preferences
-- =====================================================
-- Adds default_goals_okr_context column to user_preferences table
-- Default value is 'NONE' (hides Goal/Execute/Insight navigation items)
-- Schema: users
-- =====================================================

-- Set search path to users schema
SET search_path TO users;

-- Add default_goals_okr_context column
ALTER TABLE users.user_preferences
ADD COLUMN IF NOT EXISTS default_goals_okr_context VARCHAR(20) NOT NULL DEFAULT 'NONE';

-- Add check constraint
ALTER TABLE users.user_preferences
ADD CONSTRAINT chk_default_goals_okr_context 
CHECK (default_goals_okr_context IN ('NONE', 'LIFE', 'BUSINESS', 'WORK'));

-- Update existing rows to have NONE as default (if any exist)
UPDATE users.user_preferences
SET default_goals_okr_context = 'NONE'
WHERE default_goals_okr_context IS NULL;

-- Add comment
COMMENT ON COLUMN users.user_preferences.default_goals_okr_context IS 'Default Goals-OKR context: NONE (hide Goal/Execute/Insight), LIFE, BUSINESS, or WORK';

-- Reset search path
RESET search_path;
