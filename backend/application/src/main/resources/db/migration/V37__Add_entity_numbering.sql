-- =====================================================
-- Flyway Migration V37: Add Entity Numbering
-- =====================================================
-- Adds unique, human-readable numbers to all goal-related entities
-- Prefixes:
--   Templates: GOAL-, OBJ-, KR-, INIT-
--   Subscriptions: GOAL-SUB-, OBJ-SUB-, KR-SUB-, INIT-SUB-
--   User-created: MY-GOAL-, MY-OBJ-, MY-KR-, MY-INIT-
--   Kanban: KANBAN-
-- =====================================================

-- Set search path to goals_okr schema
SET search_path TO goals_okr;

-- =====================================================
-- Step 1: Create Sequences for all entity types
-- =====================================================
CREATE SEQUENCE IF NOT EXISTS goals_okr.seq_goal_number;
CREATE SEQUENCE IF NOT EXISTS goals_okr.seq_objective_number;
CREATE SEQUENCE IF NOT EXISTS goals_okr.seq_key_result_number;
CREATE SEQUENCE IF NOT EXISTS goals_okr.seq_initiative_number;
CREATE SEQUENCE IF NOT EXISTS goals_okr.seq_user_goal_instance_number;
CREATE SEQUENCE IF NOT EXISTS goals_okr.seq_user_objective_instance_number;
CREATE SEQUENCE IF NOT EXISTS goals_okr.seq_user_key_result_instance_number;
CREATE SEQUENCE IF NOT EXISTS goals_okr.seq_user_initiative_instance_number;
CREATE SEQUENCE IF NOT EXISTS goals_okr.seq_user_goal_number;
CREATE SEQUENCE IF NOT EXISTS goals_okr.seq_user_objective_number;
CREATE SEQUENCE IF NOT EXISTS goals_okr.seq_user_key_result_number;
CREATE SEQUENCE IF NOT EXISTS goals_okr.seq_user_initiative_number;
CREATE SEQUENCE IF NOT EXISTS goals_okr.seq_kanban_item_number;

-- =====================================================
-- Step 2: Add number columns (nullable - backwards compatible)
-- =====================================================

-- Templates
ALTER TABLE goals_okr.goals 
    ADD COLUMN IF NOT EXISTS number VARCHAR(50);

ALTER TABLE goals_okr.objectives 
    ADD COLUMN IF NOT EXISTS number VARCHAR(50);

ALTER TABLE goals_okr.key_results 
    ADD COLUMN IF NOT EXISTS number VARCHAR(50);

ALTER TABLE goals_okr.initiatives 
    ADD COLUMN IF NOT EXISTS number VARCHAR(50);

-- User instances (subscriptions)
ALTER TABLE goals_okr.user_goal_instances 
    ADD COLUMN IF NOT EXISTS number VARCHAR(50);

ALTER TABLE goals_okr.user_objective_instances 
    ADD COLUMN IF NOT EXISTS number VARCHAR(50);

ALTER TABLE goals_okr.user_key_result_instances 
    ADD COLUMN IF NOT EXISTS number VARCHAR(50);

ALTER TABLE goals_okr.user_initiative_instances 
    ADD COLUMN IF NOT EXISTS number VARCHAR(50);

-- User-created
ALTER TABLE goals_okr.user_goals 
    ADD COLUMN IF NOT EXISTS number VARCHAR(50);

ALTER TABLE goals_okr.user_objectives 
    ADD COLUMN IF NOT EXISTS number VARCHAR(50);

ALTER TABLE goals_okr.user_key_results 
    ADD COLUMN IF NOT EXISTS number VARCHAR(50);

ALTER TABLE goals_okr.user_initiatives 
    ADD COLUMN IF NOT EXISTS number VARCHAR(50);

-- Kanban
ALTER TABLE goals_okr.kanban_items 
    ADD COLUMN IF NOT EXISTS number VARCHAR(50);

-- =====================================================
-- Step 3: Create indexes for performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_goals_number ON goals_okr.goals(number);
CREATE INDEX IF NOT EXISTS idx_objectives_number ON goals_okr.objectives(number);
CREATE INDEX IF NOT EXISTS idx_key_results_number ON goals_okr.key_results(number);
CREATE INDEX IF NOT EXISTS idx_initiatives_number ON goals_okr.initiatives(number);
CREATE INDEX IF NOT EXISTS idx_user_goal_instances_number ON goals_okr.user_goal_instances(number);
CREATE INDEX IF NOT EXISTS idx_user_objective_instances_number ON goals_okr.user_objective_instances(number);
CREATE INDEX IF NOT EXISTS idx_user_key_result_instances_number ON goals_okr.user_key_result_instances(number);
CREATE INDEX IF NOT EXISTS idx_user_initiative_instances_number ON goals_okr.user_initiative_instances(number);
CREATE INDEX IF NOT EXISTS idx_user_goals_number ON goals_okr.user_goals(number);
CREATE INDEX IF NOT EXISTS idx_user_objectives_number ON goals_okr.user_objectives(number);
CREATE INDEX IF NOT EXISTS idx_user_key_results_number ON goals_okr.user_key_results(number);
CREATE INDEX IF NOT EXISTS idx_user_initiatives_number ON goals_okr.user_initiatives(number);
CREATE INDEX IF NOT EXISTS idx_kanban_items_number ON goals_okr.kanban_items(number);

-- =====================================================
-- Step 4: Migrate existing data (batch update)
-- =====================================================

-- 4.1: Goals (templates)
SELECT setval('goals_okr.seq_goal_number', 1, false);
UPDATE goals_okr.goals 
SET number = 'GOAL-' || nextval('goals_okr.seq_goal_number')
WHERE number IS NULL;
SELECT setval('goals_okr.seq_goal_number', 
    COALESCE((
        SELECT MAX(CAST(SUBSTRING(number FROM 6) AS INTEGER))
        FROM goals_okr.goals 
        WHERE number IS NOT NULL
    ), 0) + 1, false);

-- 4.2: Objectives (templates)
SELECT setval('goals_okr.seq_objective_number', 1, false);
UPDATE goals_okr.objectives 
SET number = 'OBJ-' || nextval('goals_okr.seq_objective_number')
WHERE number IS NULL;
SELECT setval('goals_okr.seq_objective_number', 
    COALESCE((
        SELECT MAX(CAST(SUBSTRING(number FROM 5) AS INTEGER))
        FROM goals_okr.objectives 
        WHERE number IS NOT NULL
    ), 0) + 1, false);

-- 4.3: Key Results (templates)
SELECT setval('goals_okr.seq_key_result_number', 1, false);
UPDATE goals_okr.key_results 
SET number = 'KR-' || nextval('goals_okr.seq_key_result_number')
WHERE number IS NULL;
SELECT setval('goals_okr.seq_key_result_number', 
    COALESCE((
        SELECT MAX(CAST(SUBSTRING(number FROM 4) AS INTEGER))
        FROM goals_okr.key_results 
        WHERE number IS NOT NULL
    ), 0) + 1, false);

-- 4.4: Initiatives (templates)
SELECT setval('goals_okr.seq_initiative_number', 1, false);
UPDATE goals_okr.initiatives 
SET number = 'INIT-' || nextval('goals_okr.seq_initiative_number')
WHERE number IS NULL;
SELECT setval('goals_okr.seq_initiative_number', 
    COALESCE((
        SELECT MAX(CAST(SUBSTRING(number FROM 6) AS INTEGER))
        FROM goals_okr.initiatives 
        WHERE number IS NOT NULL
    ), 0) + 1, false);

-- 4.5: User Goal Instances (subscriptions)
SELECT setval('goals_okr.seq_user_goal_instance_number', 1, false);
UPDATE goals_okr.user_goal_instances 
SET number = 'GOAL-SUB-' || nextval('goals_okr.seq_user_goal_instance_number')
WHERE number IS NULL;
SELECT setval('goals_okr.seq_user_goal_instance_number', 
    COALESCE((
        SELECT MAX(CAST(SUBSTRING(number FROM 10) AS INTEGER))
        FROM goals_okr.user_goal_instances 
        WHERE number IS NOT NULL
    ), 0) + 1, false);

-- 4.6: User Objective Instances (subscriptions)
SELECT setval('goals_okr.seq_user_objective_instance_number', 1, false);
UPDATE goals_okr.user_objective_instances 
SET number = 'OBJ-SUB-' || nextval('goals_okr.seq_user_objective_instance_number')
WHERE number IS NULL;
SELECT setval('goals_okr.seq_user_objective_instance_number', 
    COALESCE((
        SELECT MAX(CAST(SUBSTRING(number FROM 9) AS INTEGER))
        FROM goals_okr.user_objective_instances 
        WHERE number IS NOT NULL
    ), 0) + 1, false);

-- 4.7: User Key Result Instances (subscriptions)
SELECT setval('goals_okr.seq_user_key_result_instance_number', 1, false);
UPDATE goals_okr.user_key_result_instances 
SET number = 'KR-SUB-' || nextval('goals_okr.seq_user_key_result_instance_number')
WHERE number IS NULL;
SELECT setval('goals_okr.seq_user_key_result_instance_number', 
    COALESCE((
        SELECT MAX(CAST(SUBSTRING(number FROM 8) AS INTEGER))
        FROM goals_okr.user_key_result_instances 
        WHERE number IS NOT NULL
    ), 0) + 1, false);

-- 4.8: User Initiative Instances (subscriptions)
SELECT setval('goals_okr.seq_user_initiative_instance_number', 1, false);
UPDATE goals_okr.user_initiative_instances 
SET number = 'INIT-SUB-' || nextval('goals_okr.seq_user_initiative_instance_number')
WHERE number IS NULL;
SELECT setval('goals_okr.seq_user_initiative_instance_number', 
    COALESCE((
        SELECT MAX(CAST(SUBSTRING(number FROM 10) AS INTEGER))
        FROM goals_okr.user_initiative_instances 
        WHERE number IS NOT NULL
    ), 0) + 1, false);

-- 4.9: User Goals (user-created)
SELECT setval('goals_okr.seq_user_goal_number', 1, false);
UPDATE goals_okr.user_goals 
SET number = 'MY-GOAL-' || nextval('goals_okr.seq_user_goal_number')
WHERE number IS NULL;
SELECT setval('goals_okr.seq_user_goal_number', 
    COALESCE((
        SELECT MAX(CAST(SUBSTRING(number FROM 9) AS INTEGER))
        FROM goals_okr.user_goals 
        WHERE number IS NOT NULL
    ), 0) + 1, false);

-- 4.10: User Objectives (user-created)
SELECT setval('goals_okr.seq_user_objective_number', 1, false);
UPDATE goals_okr.user_objectives 
SET number = 'MY-OBJ-' || nextval('goals_okr.seq_user_objective_number')
WHERE number IS NULL;
SELECT setval('goals_okr.seq_user_objective_number', 
    COALESCE((
        SELECT MAX(CAST(SUBSTRING(number FROM 8) AS INTEGER))
        FROM goals_okr.user_objectives 
        WHERE number IS NOT NULL
    ), 0) + 1, false);

-- 4.11: User Key Results (user-created)
SELECT setval('goals_okr.seq_user_key_result_number', 1, false);
UPDATE goals_okr.user_key_results 
SET number = 'MY-KR-' || nextval('goals_okr.seq_user_key_result_number')
WHERE number IS NULL;
SELECT setval('goals_okr.seq_user_key_result_number', 
    COALESCE((
        SELECT MAX(CAST(SUBSTRING(number FROM 7) AS INTEGER))
        FROM goals_okr.user_key_results 
        WHERE number IS NOT NULL
    ), 0) + 1, false);

-- 4.12: User Initiatives (user-created)
SELECT setval('goals_okr.seq_user_initiative_number', 1, false);
UPDATE goals_okr.user_initiatives 
SET number = 'MY-INIT-' || nextval('goals_okr.seq_user_initiative_number')
WHERE number IS NULL;
SELECT setval('goals_okr.seq_user_initiative_number', 
    COALESCE((
        SELECT MAX(CAST(SUBSTRING(number FROM 9) AS INTEGER))
        FROM goals_okr.user_initiatives 
        WHERE number IS NOT NULL
    ), 0) + 1, false);

-- 4.13: Kanban Items
SELECT setval('goals_okr.seq_kanban_item_number', 1, false);
UPDATE goals_okr.kanban_items 
SET number = 'KANBAN-' || nextval('goals_okr.seq_kanban_item_number')
WHERE number IS NULL;
SELECT setval('goals_okr.seq_kanban_item_number', 
    COALESCE((
        SELECT MAX(CAST(SUBSTRING(number FROM 8) AS INTEGER))
        FROM goals_okr.kanban_items 
        WHERE number IS NOT NULL
    ), 0) + 1, false);

-- Reset search path
RESET search_path;
