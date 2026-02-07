-- =====================================================
-- Flyway Migration V19: Fix Key Result Target Value Constraint
-- =====================================================
-- Updates the check constraint to allow target_value >= 0
-- (instead of > 0) to support key results with target of 0
-- =====================================================

-- Set search path to goals_okr schema
SET search_path TO goals_okr;

-- Drop the existing constraint
ALTER TABLE goals_okr.key_results 
DROP CONSTRAINT IF EXISTS chk_key_result_target_value;

-- Add the updated constraint allowing >= 0
ALTER TABLE goals_okr.key_results 
ADD CONSTRAINT chk_key_result_target_value CHECK (target_value >= 0);

-- Reset search path
RESET search_path;
