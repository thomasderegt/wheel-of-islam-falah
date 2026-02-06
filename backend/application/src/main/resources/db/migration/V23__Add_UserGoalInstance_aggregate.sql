-- =====================================================
-- Flyway Migration V23: Add UserGoalInstance Aggregate
-- =====================================================
-- Introduces UserGoalInstance as aggregate root for user-specific goal instances
-- Refactors existing entities to follow strict DDD pattern (userId only in aggregate root)
-- =====================================================

-- Set search path to goals_okr schema
SET search_path TO goals_okr;

-- =====================================================
-- 1. Create user_goal_instances table (Aggregate Root)
-- =====================================================
CREATE TABLE IF NOT EXISTS goals_okr.user_goal_instances (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL, -- ⭐ ALLEEN hier in de aggregate!
    goal_id BIGINT NOT NULL, -- FK to goals_okr.goals (template)
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    CONSTRAINT fk_user_goal_instance_goal FOREIGN KEY (goal_id)
        REFERENCES goals_okr.goals(id) ON DELETE CASCADE,
    CONSTRAINT uk_user_goal_instance UNIQUE (user_id, goal_id) -- One subscription per user per goal
);

CREATE INDEX IF NOT EXISTS idx_user_goal_instances_user ON goals_okr.user_goal_instances(user_id);
CREATE INDEX IF NOT EXISTS idx_user_goal_instances_goal ON goals_okr.user_goal_instances(goal_id);

COMMENT ON TABLE goals_okr.user_goal_instances IS 'User-specific goal instances (subscriptions/enrollments). Aggregate root for OKR user instances.';
COMMENT ON COLUMN goals_okr.user_goal_instances.user_id IS 'User ID - ONLY place where userId exists in the aggregate (strikt DDD)';
COMMENT ON COLUMN goals_okr.user_goal_instances.goal_id IS 'Reference to goal template';

-- =====================================================
-- 2. Modify user_objective_instances table
-- =====================================================
-- Add user_goal_instance_id column
ALTER TABLE goals_okr.user_objective_instances
    ADD COLUMN IF NOT EXISTS user_goal_instance_id BIGINT;

-- Add foreign key constraint
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_user_objective_instance_goal_instance'
    ) THEN
        ALTER TABLE goals_okr.user_objective_instances
            ADD CONSTRAINT fk_user_objective_instance_goal_instance
            FOREIGN KEY (user_goal_instance_id)
            REFERENCES goals_okr.user_goal_instances(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Migrate existing data (if any)
-- Note: Since there's no production data, this is a placeholder for future migrations
-- If there were existing UserObjectiveInstances, we would:
-- 1. Create temporary UserGoalInstances for each unique (user_id, goal_id) combination
-- 2. Update user_objective_instances.user_goal_instance_id to reference the new instances
-- 3. Then drop user_id column

-- Remove user_id column (now via UserGoalInstance)
ALTER TABLE goals_okr.user_objective_instances
    DROP COLUMN IF EXISTS user_id;

CREATE INDEX IF NOT EXISTS idx_user_objective_instances_goal_instance 
    ON goals_okr.user_objective_instances(user_goal_instance_id);

COMMENT ON COLUMN goals_okr.user_objective_instances.user_goal_instance_id IS 'FK to UserGoalInstance (aggregate root). userId is accessed via this relationship.';

-- =====================================================
-- 3. Modify key_result_progress table
-- =====================================================
-- Remove user_id column (now via UserObjectiveInstance → UserGoalInstance)
ALTER TABLE goals_okr.key_result_progress
    DROP COLUMN IF EXISTS user_id;

COMMENT ON TABLE goals_okr.key_result_progress IS 'Progress tracking for Key Results. userId is accessed via userObjectiveInstanceId → userGoalInstanceId → userId.';

-- =====================================================
-- 4. Modify initiatives table
-- =====================================================
-- Remove user_id column (now via UserObjectiveInstance → UserGoalInstance)
ALTER TABLE goals_okr.initiatives
    DROP COLUMN IF EXISTS user_id;

COMMENT ON TABLE goals_okr.initiatives IS 'User-specific initiatives. userId is accessed via userObjectiveInstanceId → userGoalInstanceId → userId.';

-- =====================================================
-- 5. Modify kanban_items table
-- =====================================================
-- Add user_goal_instance_id for context (optional, for KEY_RESULT and INITIATIVE items)
ALTER TABLE goals_okr.kanban_items
    ADD COLUMN IF NOT EXISTS user_goal_instance_id BIGINT;

-- Add foreign key constraint
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_kanban_item_goal_instance'
    ) THEN
        ALTER TABLE goals_okr.kanban_items
            ADD CONSTRAINT fk_kanban_item_goal_instance
            FOREIGN KEY (user_goal_instance_id)
            REFERENCES goals_okr.user_goal_instances(id) ON DELETE CASCADE;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_kanban_items_goal_instance 
    ON goals_okr.kanban_items(user_goal_instance_id);

COMMENT ON COLUMN goals_okr.kanban_items.user_goal_instance_id IS 'Optional context for KEY_RESULT and INITIATIVE items. itemId now refers to instance IDs, not template IDs.';

-- Reset search path
RESET search_path;
