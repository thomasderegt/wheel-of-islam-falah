-- =====================================================
-- Flyway Migration V57: Objectives → life_domain_id, UserObjectiveInstances → user_id; drop Goal layer
-- =====================================================
-- Removes the Goal layer from OKR: objectives hang directly under life domain,
-- user_objective_instances get user_id (no longer via user_goal_instance).
-- Tables goals and user_goal_instances are dropped.
-- Safe to run after V56 (data cleared); migrates structure only.
-- =====================================================

SET search_path TO goals_okr;

-- =====================================================
-- 1. objectives: goal_id → life_domain_id
-- =====================================================
ALTER TABLE goals_okr.objectives
    ADD COLUMN IF NOT EXISTS life_domain_id BIGINT;

-- Copy life_domain from goals (no-op if tables empty)
UPDATE goals_okr.objectives o
SET life_domain_id = g.life_domain_id
FROM goals_okr.goals g
WHERE o.goal_id = g.id;

-- Drop old constraint and column
ALTER TABLE goals_okr.objectives
    DROP CONSTRAINT IF EXISTS fk_objective_goal;

ALTER TABLE goals_okr.objectives
    DROP CONSTRAINT IF EXISTS uk_objective_goal_order;

ALTER TABLE goals_okr.objectives
    DROP COLUMN IF EXISTS goal_id;

-- Enforce NOT NULL (safe after V56 or after backfill)
ALTER TABLE goals_okr.objectives
    ALTER COLUMN life_domain_id SET NOT NULL;

ALTER TABLE goals_okr.objectives
    ADD CONSTRAINT fk_objective_life_domain
        FOREIGN KEY (life_domain_id) REFERENCES goals_okr.life_domains(id) ON DELETE CASCADE;

ALTER TABLE goals_okr.objectives
    ADD CONSTRAINT uk_objective_life_domain_order UNIQUE (life_domain_id, order_index);

-- Indexes
DROP INDEX IF EXISTS goals_okr.idx_objectives_goal;
DROP INDEX IF EXISTS goals_okr.idx_objectives_order;
CREATE INDEX IF NOT EXISTS idx_objectives_life_domain ON goals_okr.objectives(life_domain_id);
CREATE INDEX IF NOT EXISTS idx_objectives_life_domain_order ON goals_okr.objectives(life_domain_id, order_index);

-- =====================================================
-- 2. user_objective_instances: user_goal_instance_id → user_id
-- =====================================================
ALTER TABLE goals_okr.user_objective_instances
    ADD COLUMN IF NOT EXISTS user_id BIGINT;

-- Copy user_id from user_goal_instances (no-op if empty)
UPDATE goals_okr.user_objective_instances uoi
SET user_id = ugi.user_id
FROM goals_okr.user_goal_instances ugi
WHERE uoi.user_goal_instance_id = ugi.id;

-- Drop old FK and column
ALTER TABLE goals_okr.user_objective_instances
    DROP CONSTRAINT IF EXISTS fk_user_objective_instance_goal_instance;

ALTER TABLE goals_okr.user_objective_instances
    DROP COLUMN IF EXISTS user_goal_instance_id;

-- Enforce NOT NULL
ALTER TABLE goals_okr.user_objective_instances
    ALTER COLUMN user_id SET NOT NULL;

-- Index (soft reference to users.users; no FK)
DROP INDEX IF EXISTS goals_okr.idx_user_objective_instances_goal_instance;
CREATE INDEX IF NOT EXISTS idx_user_objective_instances_user ON goals_okr.user_objective_instances(user_id);

-- =====================================================
-- 3. Drop Goal layer tables
-- =====================================================
DROP TABLE IF EXISTS goals_okr.user_goal_instances CASCADE;
DROP TABLE IF EXISTS goals_okr.goals CASCADE;

RESET search_path;
