-- =====================================================
-- Flyway Migration V20: Add Goal Layer to OKR Structure
-- =====================================================
-- Refactors OKR structure to include Goal layer:
-- Old: LifeDomain → Objective → KeyResult
-- New: LifeDomain → Goal → Objective → KeyResult
-- 
-- This migration works for both:
-- 1. Existing databases with data (migrates existing data)
-- 2. New databases without data (just creates structure, V21 will seed)
-- =====================================================

-- Set search path to goals_okr schema
SET search_path TO goals_okr;

-- =====================================================
-- Step 1: Check if we have existing data to migrate
-- =====================================================
DO $$
DECLARE
    has_existing_data BOOLEAN;
BEGIN
    SELECT EXISTS(SELECT 1 FROM goals_okr.objectives LIMIT 1) INTO has_existing_data;
    
    -- Store result in a temp table for later use
    CREATE TEMP TABLE IF NOT EXISTS migration_state AS
    SELECT has_existing_data AS has_data;
    
    -- If no data exists, we'll skip data migration steps
    IF NOT has_existing_data THEN
        RAISE NOTICE 'No existing data found - will only create new structure';
    ELSE
        RAISE NOTICE 'Existing data found - will migrate data';
    END IF;
END $$;

-- =====================================================
-- Step 2: Create new goals table
-- =====================================================
CREATE TABLE IF NOT EXISTS goals_okr.goals (
    id BIGSERIAL PRIMARY KEY,
    life_domain_id BIGINT NOT NULL, -- FK to goals.life_domains (shared schema)
    title_nl VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    description_nl TEXT,
    description_en TEXT,
    order_index INTEGER NOT NULL, -- Order within the life domain
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_goal_domain FOREIGN KEY (life_domain_id)
        REFERENCES goals.life_domains(id) ON DELETE CASCADE,
    CONSTRAINT uk_goal_domain_order UNIQUE (life_domain_id, order_index)
);

-- Indexes for goals
CREATE INDEX IF NOT EXISTS idx_goals_domain ON goals_okr.goals(life_domain_id);
CREATE INDEX IF NOT EXISTS idx_goals_order ON goals_okr.goals(life_domain_id, order_index);

-- =====================================================
-- Step 3: Migrate data: objectives → goals (only if data exists)
-- =====================================================
DO $$
DECLARE
    has_data BOOLEAN;
BEGIN
    SELECT ms.has_data INTO has_data FROM migration_state ms LIMIT 1;
    
    IF has_data THEN
        -- Migrate existing objectives to goals
        INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index, created_at, updated_at)
        SELECT life_domain_id, title_nl, title_en, description_nl, description_en, order_index, created_at, updated_at
        FROM goals_okr.objectives
        ORDER BY life_domain_id, order_index
        ON CONFLICT (life_domain_id, order_index) DO NOTHING;
    END IF;
END $$;

-- =====================================================
-- Step 4: Drop foreign key constraints that reference objectives
-- =====================================================
ALTER TABLE goals_okr.user_objective_instances 
    DROP CONSTRAINT IF EXISTS fk_user_objective_instance_objective;

ALTER TABLE goals_okr.key_results 
    DROP CONSTRAINT IF EXISTS fk_key_result_objective;

ALTER TABLE goals_okr.initiatives
    DROP CONSTRAINT IF EXISTS fk_initiative_key_result;

ALTER TABLE goals_okr.key_result_progress
    DROP CONSTRAINT IF EXISTS fk_progress_key_result;

-- =====================================================
-- Step 5: Drop and recreate objectives table with new structure
-- =====================================================
-- First, backup existing data if it exists
CREATE TEMP TABLE IF NOT EXISTS temp_objectives_backup AS
SELECT * FROM goals_okr.objectives WHERE EXISTS (SELECT 1 FROM migration_state ms WHERE ms.has_data = true);

DROP TABLE IF EXISTS goals_okr.objectives CASCADE;

CREATE TABLE goals_okr.objectives (
    id BIGSERIAL PRIMARY KEY,
    goal_id BIGINT NOT NULL, -- FK to goals_okr.goals (was life_domain_id)
    title_nl VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    description_nl TEXT,
    description_en TEXT,
    order_index INTEGER NOT NULL, -- Order within the goal
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_objective_goal FOREIGN KEY (goal_id)
        REFERENCES goals_okr.goals(id) ON DELETE CASCADE,
    CONSTRAINT uk_objective_goal_order UNIQUE (goal_id, order_index)
);

-- Indexes for objectives
CREATE INDEX IF NOT EXISTS idx_objectives_goal ON goals_okr.objectives(goal_id);
CREATE INDEX IF NOT EXISTS idx_objectives_order ON goals_okr.objectives(goal_id, order_index);

-- =====================================================
-- Step 6: Migrate data: key_results → objectives (only if data exists)
-- =====================================================
DO $$
DECLARE
    has_data BOOLEAN;
BEGIN
    SELECT ms.has_data INTO has_data FROM migration_state ms LIMIT 1;
    
    IF has_data THEN
        -- Migrate key_results to objectives (using goal_id from temp mapping)
        INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index, created_at, updated_at)
        SELECT 
            g.id AS goal_id,
            kr.title_nl,
            kr.title_en,
            kr.description_nl,
            kr.description_en,
            kr.order_index,
            kr.created_at,
            kr.updated_at
        FROM goals_okr.key_results kr
        JOIN goals_okr.goals g ON g.life_domain_id = (
            SELECT life_domain_id FROM temp_objectives_backup tob 
            WHERE tob.id = kr.objective_id LIMIT 1
        )
        WHERE EXISTS (SELECT 1 FROM temp_objectives_backup WHERE id = kr.objective_id)
        ON CONFLICT (goal_id, order_index) DO NOTHING;
    END IF;
END $$;

-- =====================================================
-- Step 7: Drop and recreate key_results table with target_value/unit
-- =====================================================
-- Backup existing key_results if they exist
CREATE TEMP TABLE IF NOT EXISTS temp_key_results_backup AS
SELECT * FROM goals_okr.key_results WHERE EXISTS (SELECT 1 FROM migration_state ms WHERE ms.has_data = true);

DROP TABLE IF EXISTS goals_okr.key_results CASCADE;

CREATE TABLE goals_okr.key_results (
    id BIGSERIAL PRIMARY KEY,
    objective_id BIGINT NOT NULL, -- FK to goals_okr.objectives
    title_nl VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    description_nl TEXT,
    description_en TEXT,
    target_value DECIMAL(10,2) NOT NULL, -- Target value (e.g., 30, 7, 100.00)
    unit VARCHAR(50) NOT NULL, -- Unit of measurement (e.g., "dagen", "uren", "euro", "percentage", "keren")
    order_index INTEGER NOT NULL, -- Order within the objective
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_key_result_objective FOREIGN KEY (objective_id)
        REFERENCES goals_okr.objectives(id) ON DELETE CASCADE,
    CONSTRAINT uk_key_result_objective_order UNIQUE (objective_id, order_index),
    CONSTRAINT chk_key_result_target_value CHECK (target_value >= 0)
);

-- Indexes for key_results
CREATE INDEX IF NOT EXISTS idx_key_results_objective ON goals_okr.key_results(objective_id);
CREATE INDEX IF NOT EXISTS idx_key_results_order ON goals_okr.key_results(objective_id, order_index);

-- =====================================================
-- Step 8: Migrate data: backup → new key_results (only if data exists)
-- =====================================================
DO $$
DECLARE
    has_data BOOLEAN;
BEGIN
    SELECT ms.has_data INTO has_data FROM migration_state ms LIMIT 1;
    
    IF has_data THEN
        -- Create one key_result per old key_result with generic title
        INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index, created_at, updated_at)
        SELECT 
            o.id AS objective_id,
            'Doel: ' || tkrb.target_value::TEXT || ' ' || tkrb.unit AS title_nl,
            'Target: ' || tkrb.target_value::TEXT || ' ' || tkrb.unit AS title_en,
            tkrb.description_nl,
            tkrb.description_en,
            tkrb.target_value,
            tkrb.unit,
            1 AS order_index, -- All start at 1
            tkrb.created_at,
            tkrb.updated_at
        FROM temp_key_results_backup tkrb
        JOIN temp_objectives_backup tob ON tob.id = tkrb.objective_id
        JOIN goals_okr.goals g ON g.life_domain_id = tob.life_domain_id 
            AND g.order_index = tob.order_index
        JOIN goals_okr.objectives o ON o.goal_id = g.id
            AND o.title_nl = tkrb.title_nl
        ON CONFLICT (objective_id, order_index) DO NOTHING;
    END IF;
END $$;

-- =====================================================
-- Step 9: Update user_objective_instances (only if data exists)
-- =====================================================
DO $$
DECLARE
    has_data BOOLEAN;
BEGIN
    SELECT ms.has_data INTO has_data FROM migration_state ms LIMIT 1;
    
    IF has_data THEN
        -- Update user_objective_instances to reference new objectives
        UPDATE goals_okr.user_objective_instances uoi
        SET objective_id = (
            SELECT o.id
            FROM temp_objectives_backup tob
            JOIN goals_okr.goals g ON g.life_domain_id = tob.life_domain_id 
                AND g.order_index = tob.order_index
            JOIN goals_okr.objectives o ON o.goal_id = g.id
            WHERE tob.id = uoi.objective_id
            ORDER BY o.id
            LIMIT 1
        )
        WHERE EXISTS (
            SELECT 1 FROM temp_objectives_backup tob 
            WHERE tob.id = uoi.objective_id
        );
    END IF;
END $$;

-- Recreate foreign key constraint (drop first if it exists)
ALTER TABLE goals_okr.user_objective_instances
    DROP CONSTRAINT IF EXISTS fk_user_objective_instance_objective;
    
ALTER TABLE goals_okr.user_objective_instances
    ADD CONSTRAINT fk_user_objective_instance_objective 
    FOREIGN KEY (objective_id) REFERENCES goals_okr.objectives(id) ON DELETE CASCADE;

-- =====================================================
-- Step 10: Update key_result_progress (only if data exists)
-- =====================================================
DO $$
DECLARE
    has_data BOOLEAN;
BEGIN
    SELECT ms.has_data INTO has_data FROM migration_state ms LIMIT 1;
    
    IF has_data THEN
        -- Update key_result_progress to reference new key_results
        UPDATE goals_okr.key_result_progress krp
        SET key_result_id = (
            SELECT kr.id
            FROM temp_key_results_backup tkrb
            JOIN temp_objectives_backup tob ON tob.id = tkrb.objective_id
            JOIN goals_okr.goals g ON g.life_domain_id = tob.life_domain_id 
                AND g.order_index = tob.order_index
            JOIN goals_okr.objectives o ON o.goal_id = g.id
            JOIN goals_okr.key_results kr ON kr.objective_id = o.id
            WHERE tkrb.id = krp.key_result_id
            ORDER BY kr.id
            LIMIT 1
        )
        WHERE EXISTS (
            SELECT 1 FROM temp_key_results_backup tkrb 
            WHERE tkrb.id = krp.key_result_id
        );
    END IF;
END $$;

-- Recreate foreign key constraints (drop first if they exist)
ALTER TABLE goals_okr.key_result_progress
    DROP CONSTRAINT IF EXISTS fk_progress_key_result;
    
ALTER TABLE goals_okr.key_result_progress
    ADD CONSTRAINT fk_progress_key_result 
    FOREIGN KEY (key_result_id) REFERENCES goals_okr.key_results(id) ON DELETE CASCADE;

ALTER TABLE goals_okr.key_result_progress
    DROP CONSTRAINT IF EXISTS fk_progress_user_instance;
    
ALTER TABLE goals_okr.key_result_progress
    ADD CONSTRAINT fk_progress_user_instance 
    FOREIGN KEY (user_objective_instance_id) REFERENCES goals_okr.user_objective_instances(id) ON DELETE CASCADE;

-- =====================================================
-- Step 11: Update initiatives (only if data exists)
-- =====================================================
DO $$
DECLARE
    has_data BOOLEAN;
BEGIN
    SELECT ms.has_data INTO has_data FROM migration_state ms LIMIT 1;
    
    IF has_data THEN
        -- Update initiatives to reference new key_results
        UPDATE goals_okr.initiatives i
        SET key_result_id = (
            SELECT kr.id
            FROM temp_key_results_backup tkrb
            JOIN temp_objectives_backup tob ON tob.id = tkrb.objective_id
            JOIN goals_okr.goals g ON g.life_domain_id = tob.life_domain_id 
                AND g.order_index = tob.order_index
            JOIN goals_okr.objectives o ON o.goal_id = g.id
            JOIN goals_okr.key_results kr ON kr.objective_id = o.id
            WHERE tkrb.id = i.key_result_id
            ORDER BY kr.id
            LIMIT 1
        )
        WHERE EXISTS (
            SELECT 1 FROM temp_key_results_backup tkrb 
            WHERE tkrb.id = i.key_result_id
        );
    END IF;
END $$;

-- Recreate foreign key constraints (drop first if they exist)
ALTER TABLE goals_okr.initiatives
    DROP CONSTRAINT IF EXISTS fk_initiative_key_result;
    
ALTER TABLE goals_okr.initiatives
    ADD CONSTRAINT fk_initiative_key_result 
    FOREIGN KEY (key_result_id) REFERENCES goals_okr.key_results(id) ON DELETE CASCADE;

ALTER TABLE goals_okr.initiatives
    DROP CONSTRAINT IF EXISTS fk_initiative_user_instance;
    
ALTER TABLE goals_okr.initiatives
    ADD CONSTRAINT fk_initiative_user_instance 
    FOREIGN KEY (user_objective_instance_id) REFERENCES goals_okr.user_objective_instances(id) ON DELETE CASCADE;

-- Reset search path
RESET search_path;
