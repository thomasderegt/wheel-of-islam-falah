-- =====================================================
-- Flyway Migration V63: Initiatives - created_by_user_id + Unify with user_initiatives
-- =====================================================
-- 1. Add created_by_user_id and custom initiative columns to initiatives
-- 2. Migrate user_initiatives data to initiatives
-- 3. Update user_initiative_instances to point to initiatives
-- 4. Drop user_initiatives table
-- =====================================================

SET search_path TO goals_okr;

-- =====================================================
-- Step 1: Add columns to initiatives for custom initiatives
-- =====================================================
ALTER TABLE goals_okr.initiatives
    ADD COLUMN IF NOT EXISTS created_by_user_id BIGINT;

ALTER TABLE goals_okr.initiatives
    ADD COLUMN IF NOT EXISTS target_date DATE;

ALTER TABLE goals_okr.initiatives
    ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'ACTIVE';

ALTER TABLE goals_okr.initiatives
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;

ALTER TABLE goals_okr.initiatives
    ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP;

ALTER TABLE goals_okr.initiatives
    ADD COLUMN IF NOT EXISTS learning_flow_enrollment_id BIGINT;

-- Make key_result_id nullable for custom initiatives (we set it from user_key_result_instance)
-- Actually keep it NOT NULL - custom initiatives get key_result_id from userKeyResultInstance.keyResultId
COMMENT ON COLUMN goals_okr.initiatives.created_by_user_id IS 'NULL = template initiative, user_id = custom initiative created by user';
COMMENT ON COLUMN goals_okr.initiatives.target_date IS 'Optional target date (mainly for custom initiatives)';
COMMENT ON COLUMN goals_okr.initiatives.status IS 'ACTIVE, COMPLETED, ARCHIVED (mainly for custom initiatives)';

-- For existing initiatives, set updated_at = created_at
UPDATE goals_okr.initiatives SET updated_at = created_at WHERE updated_at IS NULL;
ALTER TABLE goals_okr.initiatives ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_initiatives_created_by_user ON goals_okr.initiatives(created_by_user_id);

-- =====================================================
-- Step 2: Add temp column to initiatives for migration mapping
-- =====================================================
ALTER TABLE goals_okr.initiatives ADD COLUMN IF NOT EXISTS _migrated_from_user_initiative_id BIGINT;

-- =====================================================
-- Step 3: Migrate user_initiatives to initiatives
-- =====================================================
WITH ui_with_kr AS (
    SELECT ui.*, COALESCE(ui.key_result_id, ukri.key_result_id) AS kr_id
    FROM goals_okr.user_initiatives ui
    JOIN goals_okr.user_key_result_instances ukri ON ukri.id = ui.user_key_result_instance_id
    WHERE ukri.key_result_id IS NOT NULL
),
numbered AS (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY kr_id ORDER BY created_at, id) AS rn
    FROM ui_with_kr
)
INSERT INTO goals_okr.initiatives (
    key_result_id,
    title_nl,
    title_en,
    description_nl,
    description_en,
    display_order,
    number,
    created_at,
    created_by_user_id,
    target_date,
    status,
    updated_at,
    completed_at,
    learning_flow_enrollment_id,
    _migrated_from_user_initiative_id
)
SELECT
    n.kr_id,
    n.title,
    n.title,
    n.description,
    n.description,
    (SELECT COALESCE(MAX(i.display_order), 0) + n.rn FROM goals_okr.initiatives i WHERE i.key_result_id = n.kr_id),
    n.number,
    n.created_at,
    n.user_id,
    n.target_date,
    COALESCE(n.status, 'ACTIVE'),
    n.updated_at,
    n.completed_at,
    n.learning_flow_enrollment_id,
    n.id
FROM numbered n;

-- =====================================================
-- Step 4: Update user_initiative_instances to point to new initiative IDs
-- =====================================================
UPDATE goals_okr.user_initiative_instances uii
SET initiative_id = ni.id
FROM goals_okr.initiatives ni
WHERE ni._migrated_from_user_initiative_id = uii.initiative_id
  AND uii.initiative_id IN (SELECT id FROM goals_okr.user_initiatives);

-- =====================================================
-- Step 5: Drop temp column and user_initiatives table
-- =====================================================
ALTER TABLE goals_okr.initiatives DROP COLUMN IF EXISTS _migrated_from_user_initiative_id;
DROP TABLE IF EXISTS goals_okr.user_initiatives CASCADE;

RESET search_path;
