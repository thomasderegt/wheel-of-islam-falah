-- =====================================================
-- Flyway Migration V49: Remove user_goals table
-- =====================================================
-- Removes the user_goals table and related foreign key constraints
-- This is part of the migration from UserGoal to Goal template + UserGoalInstance approach
-- 
-- Note: user_objectives and user_key_results tables still exist but are no longer
--       used by the application code. They can be removed in a future migration.
-- =====================================================

SET search_path TO goals_okr;

-- Drop foreign key constraint from user_objectives to user_goals
-- This allows us to drop user_goals even if user_objectives still references it
ALTER TABLE goals_okr.user_objectives 
    DROP CONSTRAINT IF EXISTS fk_user_objective_goal;

-- Drop indexes on user_goals
DROP INDEX IF EXISTS goals_okr.idx_user_goals_user;
DROP INDEX IF EXISTS goals_okr.idx_user_goals_domain;
DROP INDEX IF EXISTS goals_okr.idx_user_goals_created;

-- Drop the user_goals table
DROP TABLE IF EXISTS goals_okr.user_goals CASCADE;

-- Drop the sequence for user goal numbers (if it exists)
DROP SEQUENCE IF EXISTS goals_okr.seq_user_goal_number;

RESET search_path;
