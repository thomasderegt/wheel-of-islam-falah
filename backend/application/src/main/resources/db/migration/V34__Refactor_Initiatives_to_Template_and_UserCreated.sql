-- =====================================================
-- Flyway Migration V34: Refactor Initiatives to Template and User-Created
-- =====================================================
-- 1. Rename initiative_suggestions → initiatives (template)
-- 2. Rename initiatives → user_initiatives (user-created)
-- 3. Update user_initiative_instances to support both (soft reference)
-- =====================================================

-- Set search path to goals_okr schema
SET search_path TO goals_okr;

-- =====================================================
-- Step 1: Rename initiative_suggestions to initiatives (template)
-- =====================================================
-- First, drop the old initiatives table constraints and rename it
-- Then rename initiative_suggestions to initiatives

-- Step 1a: Drop foreign key constraint from user_initiative_instances to initiatives
ALTER TABLE goals_okr.user_initiative_instances
    DROP CONSTRAINT IF EXISTS fk_user_initiative_instance_initiative;

-- Step 1b: Rename current initiatives table to user_initiatives (user-created)
ALTER TABLE goals_okr.initiatives
    RENAME TO user_initiatives;

-- Step 1c: Rename initiative_suggestions to initiatives (template)
ALTER TABLE goals_okr.initiative_suggestions
    RENAME TO initiatives;

-- Step 1d: Update indexes
DROP INDEX IF EXISTS goals_okr.idx_suggestions_key_result;
DROP INDEX IF EXISTS goals_okr.idx_suggestions_order;
CREATE INDEX IF NOT EXISTS idx_initiatives_key_result ON goals_okr.initiatives(key_result_id);
CREATE INDEX IF NOT EXISTS idx_initiatives_order ON goals_okr.initiatives(key_result_id, display_order);

-- Update comments
COMMENT ON TABLE goals_okr.initiatives IS 'Initiative templates for key results. Users can use these as starting points when creating their own initiatives.';
COMMENT ON TABLE goals_okr.user_initiatives IS 'User-specific initiatives created by end users (not based on templates).';

-- =====================================================
-- Step 2: Update user_initiative_instances table
-- =====================================================
-- Remove foreign key constraint - initiative_id is now a soft reference
-- It can refer to either initiatives.id (template) or user_initiatives.id (user-created)

-- The foreign key was already dropped in step 1a
-- Update comment to reflect soft reference
COMMENT ON COLUMN goals_okr.user_initiative_instances.initiative_id IS 'Soft reference to Initiative (template) OR UserInitiative (user-created). Application logic determines which table to query based on context.';

-- =====================================================
-- Step 3: Update user_initiatives table structure
-- =====================================================
-- Remove user_initiative_instance_id column (circular reference)
-- Add user_id column for direct access
-- Update key_result_id to be optional (user-created initiatives may not have a template key result)

-- Step 3a: Drop the circular foreign key constraint
ALTER TABLE goals_okr.user_initiatives
    DROP CONSTRAINT IF EXISTS fk_initiative_initiative_instance;

-- Step 3b: Add user_id column if it doesn't exist
ALTER TABLE goals_okr.user_initiatives
    ADD COLUMN IF NOT EXISTS user_id BIGINT;

-- Step 3c: Migrate user_id from user_initiative_instances
-- For existing user_initiatives, get user_id via the instance chain
UPDATE goals_okr.user_initiatives ui
SET user_id = (
    SELECT ugi.user_id
    FROM goals_okr.user_initiative_instances uiinst
    JOIN goals_okr.user_key_result_instances ukri ON ukri.id = uiinst.user_key_result_instance_id
    JOIN goals_okr.user_objective_instances uoi ON uoi.id = ukri.user_objective_instance_id
    JOIN goals_okr.user_goal_instances ugi ON ugi.id = uoi.user_goal_instance_id
    WHERE uiinst.initiative_id = ui.id
    LIMIT 1
)
WHERE ui.user_id IS NULL;

-- Step 3d: Make user_id NOT NULL after migration
ALTER TABLE goals_okr.user_initiatives
    ALTER COLUMN user_id SET NOT NULL;

-- Step 3e: Add user_key_result_instance_id column
ALTER TABLE goals_okr.user_initiatives
    ADD COLUMN IF NOT EXISTS user_key_result_instance_id BIGINT;

-- Step 3f: Migrate user_key_result_instance_id from user_initiative_instances
-- For existing user_initiatives, get user_key_result_instance_id via the instance
UPDATE goals_okr.user_initiatives ui
SET user_key_result_instance_id = (
    SELECT uiinst.user_key_result_instance_id
    FROM goals_okr.user_initiative_instances uiinst
    WHERE uiinst.initiative_id = ui.id
    LIMIT 1
)
WHERE ui.user_key_result_instance_id IS NULL;

-- Step 3g: Make user_key_result_instance_id NOT NULL after migration
ALTER TABLE goals_okr.user_initiatives
    ALTER COLUMN user_key_result_instance_id SET NOT NULL;

-- Step 3h: Remove user_initiative_instance_id column (no longer needed)
ALTER TABLE goals_okr.user_initiatives
    DROP COLUMN IF EXISTS user_initiative_instance_id;

-- Step 3i: Make key_result_id optional (user-created initiatives may not have a template)
ALTER TABLE goals_okr.user_initiatives
    ALTER COLUMN key_result_id DROP NOT NULL;

-- Step 3j: Add completed_at column if it doesn't exist
ALTER TABLE goals_okr.user_initiatives
    ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP;

-- Step 3k: Update indexes
DROP INDEX IF EXISTS goals_okr.idx_initiatives_initiative_instance;
CREATE INDEX IF NOT EXISTS idx_user_initiatives_user ON goals_okr.user_initiatives(user_id);
CREATE INDEX IF NOT EXISTS idx_user_initiatives_key_result_instance ON goals_okr.user_initiatives(user_key_result_instance_id);
CREATE INDEX IF NOT EXISTS idx_user_initiatives_key_result ON goals_okr.user_initiatives(key_result_id);

-- Update comments
COMMENT ON COLUMN goals_okr.user_initiatives.user_id IS 'User who created this initiative';
COMMENT ON COLUMN goals_okr.user_initiatives.user_key_result_instance_id IS 'FK to UserKeyResultInstance. Links initiative to user key result instance.';
COMMENT ON COLUMN goals_okr.user_initiatives.key_result_id IS 'Optional reference to KeyResult template (if initiative was inspired by a template)';

-- Reset search path
RESET search_path;
