-- =====================================================
-- Flyway Migration V33: Add UserKeyResultInstance and UserInitiativeInstance
-- =====================================================
-- Introduces UserKeyResultInstance and UserInitiativeInstance for complete OKR hierarchy
-- Refactors KeyResultProgress and Initiative to use new instance entities
-- =====================================================

-- Set search path to goals_okr schema
SET search_path TO goals_okr;

-- =====================================================
-- 1. Create user_key_result_instances table
-- =====================================================
CREATE TABLE IF NOT EXISTS goals_okr.user_key_result_instances (
    id BIGSERIAL PRIMARY KEY,
    user_objective_instance_id BIGINT NOT NULL, -- FK to goals_okr.user_objective_instances
    key_result_id BIGINT NOT NULL, -- FK to goals_okr.key_results (template)
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    CONSTRAINT fk_user_key_result_instance_objective_instance FOREIGN KEY (user_objective_instance_id)
        REFERENCES goals_okr.user_objective_instances(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_key_result_instance_key_result FOREIGN KEY (key_result_id)
        REFERENCES goals_okr.key_results(id) ON DELETE CASCADE,
    CONSTRAINT uk_user_key_result_instance UNIQUE (user_objective_instance_id, key_result_id) -- One subscription per user per key result within objective
);

CREATE INDEX IF NOT EXISTS idx_user_key_result_instances_objective_instance 
    ON goals_okr.user_key_result_instances(user_objective_instance_id);
CREATE INDEX IF NOT EXISTS idx_user_key_result_instances_key_result 
    ON goals_okr.user_key_result_instances(key_result_id);

COMMENT ON TABLE goals_okr.user_key_result_instances IS 'User-specific key result instances (subscriptions/enrollments). Part of OKR hierarchy: UserGoalInstance → UserObjectiveInstance → UserKeyResultInstance.';
COMMENT ON COLUMN goals_okr.user_key_result_instances.user_objective_instance_id IS 'FK to UserObjectiveInstance. userId is accessed via userObjectiveInstanceId → userGoalInstanceId → userId.';
COMMENT ON COLUMN goals_okr.user_key_result_instances.key_result_id IS 'Reference to key result template';

-- =====================================================
-- 2. Create user_initiative_instances table
-- =====================================================
CREATE TABLE IF NOT EXISTS goals_okr.user_initiative_instances (
    id BIGSERIAL PRIMARY KEY,
    user_key_result_instance_id BIGINT NOT NULL, -- FK to goals_okr.user_key_result_instances
    initiative_id BIGINT NOT NULL, -- FK to goals_okr.initiatives
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    CONSTRAINT fk_user_initiative_instance_key_result_instance FOREIGN KEY (user_key_result_instance_id)
        REFERENCES goals_okr.user_key_result_instances(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_initiative_instance_initiative FOREIGN KEY (initiative_id)
        REFERENCES goals_okr.initiatives(id) ON DELETE CASCADE,
    CONSTRAINT uk_user_initiative_instance UNIQUE (user_key_result_instance_id, initiative_id) -- One subscription per user per initiative within key result
);

CREATE INDEX IF NOT EXISTS idx_user_initiative_instances_key_result_instance 
    ON goals_okr.user_initiative_instances(user_key_result_instance_id);
CREATE INDEX IF NOT EXISTS idx_user_initiative_instances_initiative 
    ON goals_okr.user_initiative_instances(initiative_id);

COMMENT ON TABLE goals_okr.user_initiative_instances IS 'User-specific initiative instances (subscriptions/enrollments). Part of OKR hierarchy: UserGoalInstance → UserObjectiveInstance → UserKeyResultInstance → UserInitiativeInstance.';
COMMENT ON COLUMN goals_okr.user_initiative_instances.user_key_result_instance_id IS 'FK to UserKeyResultInstance. userId is accessed via userKeyResultInstanceId → userObjectiveInstanceId → userGoalInstanceId → userId.';
COMMENT ON COLUMN goals_okr.user_initiative_instances.initiative_id IS 'FK to Initiative (user-specific entity)';

-- =====================================================
-- 3. Modify key_result_progress table
-- =====================================================
-- Add new column for UserKeyResultInstance
ALTER TABLE goals_okr.key_result_progress
    ADD COLUMN IF NOT EXISTS user_key_result_instance_id BIGINT;

-- Migrate existing data: Create UserKeyResultInstances for existing progress records
DO $$
DECLARE
    progress_record RECORD;
    new_instance_id BIGINT;
BEGIN
    -- Loop through all existing key_result_progress records
    FOR progress_record IN 
        SELECT DISTINCT krp.id, krp.key_result_id, krp.user_objective_instance_id
        FROM goals_okr.key_result_progress krp
        WHERE krp.user_key_result_instance_id IS NULL
          AND krp.user_objective_instance_id IS NOT NULL
    LOOP
        -- Check if UserKeyResultInstance already exists
        SELECT id INTO new_instance_id
        FROM goals_okr.user_key_result_instances
        WHERE user_objective_instance_id = progress_record.user_objective_instance_id
          AND key_result_id = progress_record.key_result_id;
        
        -- If not exists, create it
        IF new_instance_id IS NULL THEN
            INSERT INTO goals_okr.user_key_result_instances (user_objective_instance_id, key_result_id, started_at)
            VALUES (progress_record.user_objective_instance_id, progress_record.key_result_id, CURRENT_TIMESTAMP)
            RETURNING id INTO new_instance_id;
        END IF;
        
        -- Update key_result_progress with new instance ID
        UPDATE goals_okr.key_result_progress
        SET user_key_result_instance_id = new_instance_id
        WHERE id = progress_record.id;
    END LOOP;
END $$;

-- Add foreign key constraint
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_key_result_progress_key_result_instance'
    ) THEN
        ALTER TABLE goals_okr.key_result_progress
            ADD CONSTRAINT fk_key_result_progress_key_result_instance
            FOREIGN KEY (user_key_result_instance_id)
            REFERENCES goals_okr.user_key_result_instances(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Make column NOT NULL after migration
ALTER TABLE goals_okr.key_result_progress
    ALTER COLUMN user_key_result_instance_id SET NOT NULL;

-- Remove old column
ALTER TABLE goals_okr.key_result_progress
    DROP COLUMN IF EXISTS user_objective_instance_id;

-- Update indexes
DROP INDEX IF EXISTS goals_okr.idx_progress_user_instance;
CREATE INDEX IF NOT EXISTS idx_progress_key_result_instance 
    ON goals_okr.key_result_progress(user_key_result_instance_id);

COMMENT ON TABLE goals_okr.key_result_progress IS 'Progress tracking for Key Results. userId is accessed via userKeyResultInstanceId → userObjectiveInstanceId → userGoalInstanceId → userId.';
COMMENT ON COLUMN goals_okr.key_result_progress.user_key_result_instance_id IS 'FK to UserKeyResultInstance. Replaces user_objective_instance_id for proper hierarchy.';

-- =====================================================
-- 4. Modify initiatives table
-- =====================================================
-- Add new column for UserInitiativeInstance
ALTER TABLE goals_okr.initiatives
    ADD COLUMN IF NOT EXISTS user_initiative_instance_id BIGINT;

-- Migrate existing data: Create UserInitiativeInstances for existing initiatives
-- Note: This requires UserKeyResultInstances to exist first
DO $$
DECLARE
    initiative_record RECORD;
    new_instance_id BIGINT;
    key_result_instance_id BIGINT;
BEGIN
    -- Loop through all existing initiatives
    FOR initiative_record IN 
        SELECT DISTINCT i.id, i.key_result_id, i.user_objective_instance_id
        FROM goals_okr.initiatives i
        WHERE i.user_initiative_instance_id IS NULL
          AND i.user_objective_instance_id IS NOT NULL
    LOOP
        -- Find or create UserKeyResultInstance for this initiative's key result
        SELECT ukri.id INTO key_result_instance_id
        FROM goals_okr.user_key_result_instances ukri
        WHERE ukri.user_objective_instance_id = initiative_record.user_objective_instance_id
          AND ukri.key_result_id = initiative_record.key_result_id;
        
        -- If UserKeyResultInstance doesn't exist, create it
        IF key_result_instance_id IS NULL THEN
            INSERT INTO goals_okr.user_key_result_instances (user_objective_instance_id, key_result_id, started_at)
            VALUES (initiative_record.user_objective_instance_id, initiative_record.key_result_id, CURRENT_TIMESTAMP)
            RETURNING id INTO key_result_instance_id;
        END IF;
        
        -- Check if UserInitiativeInstance already exists
        SELECT id INTO new_instance_id
        FROM goals_okr.user_initiative_instances
        WHERE user_key_result_instance_id = key_result_instance_id
          AND initiative_id = initiative_record.id;
        
        -- If not exists, create it
        IF new_instance_id IS NULL THEN
            INSERT INTO goals_okr.user_initiative_instances (user_key_result_instance_id, initiative_id, started_at)
            VALUES (key_result_instance_id, initiative_record.id, CURRENT_TIMESTAMP)
            RETURNING id INTO new_instance_id;
        END IF;
        
        -- Update initiative with new instance ID
        UPDATE goals_okr.initiatives
        SET user_initiative_instance_id = new_instance_id
        WHERE id = initiative_record.id;
    END LOOP;
END $$;

-- Add foreign key constraint
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_initiative_initiative_instance'
    ) THEN
        ALTER TABLE goals_okr.initiatives
            ADD CONSTRAINT fk_initiative_initiative_instance
            FOREIGN KEY (user_initiative_instance_id)
            REFERENCES goals_okr.user_initiative_instances(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Make column NOT NULL after migration
ALTER TABLE goals_okr.initiatives
    ALTER COLUMN user_initiative_instance_id SET NOT NULL;

-- Remove old column
ALTER TABLE goals_okr.initiatives
    DROP COLUMN IF EXISTS user_objective_instance_id;

-- Update indexes
DROP INDEX IF EXISTS goals_okr.idx_initiatives_user_objective_instance;
CREATE INDEX IF NOT EXISTS idx_initiatives_initiative_instance 
    ON goals_okr.initiatives(user_initiative_instance_id);

COMMENT ON TABLE goals_okr.initiatives IS 'User-specific initiatives. userId is accessed via userInitiativeInstanceId → userKeyResultInstanceId → userObjectiveInstanceId → userGoalInstanceId → userId.';
COMMENT ON COLUMN goals_okr.initiatives.user_initiative_instance_id IS 'FK to UserInitiativeInstance. Replaces user_objective_instance_id for proper hierarchy.';

-- Reset search path
RESET search_path;
