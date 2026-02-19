-- =====================================================
-- Flyway Migration V64: Key results - created_by_user_id, drop user_key_results
-- =====================================================
-- 1. Add created_by_user_id to key_results (NULL = template, user_id = custom)
-- 2. Drop user_key_results table (legacy, user_goals removed in V49)
-- =====================================================

SET search_path TO goals_okr;

-- =====================================================
-- Step 1: Add created_by_user_id to key_results
-- =====================================================
ALTER TABLE goals_okr.key_results
    ADD COLUMN IF NOT EXISTS created_by_user_id BIGINT;

COMMENT ON COLUMN goals_okr.key_results.created_by_user_id IS 'NULL = template key result, user_id = custom key result created by user';

CREATE INDEX IF NOT EXISTS idx_key_results_created_by_user ON goals_okr.key_results(created_by_user_id);

-- =====================================================
-- Step 2: Drop user_key_results (legacy - user_objectives orphaned after V49)
-- =====================================================
DROP TABLE IF EXISTS goals_okr.user_key_results CASCADE;

-- user_objectives can be dropped too (orphaned since user_goals removed)
DROP TABLE IF EXISTS goals_okr.user_objectives CASCADE;

RESET search_path;
