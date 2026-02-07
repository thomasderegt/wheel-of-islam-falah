-- =====================================================
-- Flyway Migration V27: Create User-Specific Goals, Objectives, and Key Results
-- =====================================================
-- Adds support for users to create their own personal goals, objectives, and key results
-- These are separate from template-based goals and are user-specific only
-- =====================================================

-- Set search path to goals_okr schema
SET search_path TO goals_okr;

-- =====================================================
-- 1. Create user_goals table (User-specific Goals)
-- =====================================================
CREATE TABLE IF NOT EXISTS goals_okr.user_goals (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL, -- Soft reference to users.users
    life_domain_id BIGINT, -- Optional FK to goals.life_domains for categorization
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    CONSTRAINT chk_user_goal_title_not_empty CHECK (LENGTH(TRIM(title)) > 0)
);

-- Indexes for user_goals
CREATE INDEX IF NOT EXISTS idx_user_goals_user ON goals_okr.user_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_goals_domain ON goals_okr.user_goals(life_domain_id);
CREATE INDEX IF NOT EXISTS idx_user_goals_created ON goals_okr.user_goals(user_id, created_at DESC);

COMMENT ON TABLE goals_okr.user_goals IS 'User-specific goals created by end users (not based on templates)';
COMMENT ON COLUMN goals_okr.user_goals.user_id IS 'User who created this goal';
COMMENT ON COLUMN goals_okr.user_goals.life_domain_id IS 'Optional categorization by life domain';

-- =====================================================
-- 2. Create user_objectives table (User-specific Objectives)
-- =====================================================
CREATE TABLE IF NOT EXISTS goals_okr.user_objectives (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL, -- Soft reference to users.users
    user_goal_id BIGINT NOT NULL, -- FK to goals_okr.user_goals
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    CONSTRAINT fk_user_objective_goal FOREIGN KEY (user_goal_id)
        REFERENCES goals_okr.user_goals(id) ON DELETE CASCADE,
    CONSTRAINT chk_user_objective_title_not_empty CHECK (LENGTH(TRIM(title)) > 0)
);

-- Indexes for user_objectives
CREATE INDEX IF NOT EXISTS idx_user_objectives_user ON goals_okr.user_objectives(user_id);
CREATE INDEX IF NOT EXISTS idx_user_objectives_goal ON goals_okr.user_objectives(user_goal_id);
CREATE INDEX IF NOT EXISTS idx_user_objectives_created ON goals_okr.user_objectives(user_goal_id, created_at DESC);

COMMENT ON TABLE goals_okr.user_objectives IS 'User-specific objectives created by end users (not based on templates)';
COMMENT ON COLUMN goals_okr.user_objectives.user_id IS 'User who created this objective';
COMMENT ON COLUMN goals_okr.user_objectives.user_goal_id IS 'FK to user-specific goal';

-- =====================================================
-- 3. Create user_key_results table (User-specific Key Results)
-- =====================================================
CREATE TABLE IF NOT EXISTS goals_okr.user_key_results (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL, -- Soft reference to users.users
    user_objective_id BIGINT NOT NULL, -- FK to goals_okr.user_objectives
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_value DECIMAL(10,2), -- Optional target value
    unit VARCHAR(50), -- Unit of measurement (e.g., "dagen", "uren", "euro")
    current_value DECIMAL(10,2) DEFAULT 0, -- Current progress value
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    CONSTRAINT fk_user_key_result_objective FOREIGN KEY (user_objective_id)
        REFERENCES goals_okr.user_objectives(id) ON DELETE CASCADE,
    CONSTRAINT chk_user_key_result_title_not_empty CHECK (LENGTH(TRIM(title)) > 0),
    CONSTRAINT chk_user_key_result_target_value CHECK (target_value IS NULL OR target_value > 0),
    CONSTRAINT chk_user_key_result_current_value CHECK (current_value >= 0)
);

-- Indexes for user_key_results
CREATE INDEX IF NOT EXISTS idx_user_key_results_user ON goals_okr.user_key_results(user_id);
CREATE INDEX IF NOT EXISTS idx_user_key_results_objective ON goals_okr.user_key_results(user_objective_id);
CREATE INDEX IF NOT EXISTS idx_user_key_results_created ON goals_okr.user_key_results(user_objective_id, created_at DESC);

COMMENT ON TABLE goals_okr.user_key_results IS 'User-specific key results created by end users (not based on templates)';
COMMENT ON COLUMN goals_okr.user_key_results.user_id IS 'User who created this key result';
COMMENT ON COLUMN goals_okr.user_key_results.user_objective_id IS 'FK to user-specific objective';
COMMENT ON COLUMN goals_okr.user_key_results.target_value IS 'Optional target value for tracking progress';
COMMENT ON COLUMN goals_okr.user_key_results.current_value IS 'Current progress value (defaults to 0)';

-- Reset search path
RESET search_path;
