-- =====================================================
-- Flyway Migration V50: Add ALL to goals_okr_context constraint
-- =====================================================
-- Updates the check constraint to allow 'ALL' as a valid value
-- for default_goals_okr_context in user_preferences table
-- Schema: users
-- =====================================================

-- Set search path to users schema
SET search_path TO users;

-- Drop the existing constraint
ALTER TABLE users.user_preferences
DROP CONSTRAINT IF EXISTS chk_default_goals_okr_context;

-- Add the updated constraint with ALL included
ALTER TABLE users.user_preferences
ADD CONSTRAINT chk_default_goals_okr_context 
CHECK (default_goals_okr_context IN ('NONE', 'LIFE', 'BUSINESS', 'WORK', 'ALL'));

-- Update comment
COMMENT ON COLUMN users.user_preferences.default_goals_okr_context IS 'Default Goals-OKR context: NONE (hide Goal/Execute/Insight), LIFE, BUSINESS, WORK, or ALL (show all wheels)';

-- Reset search path
RESET search_path;
