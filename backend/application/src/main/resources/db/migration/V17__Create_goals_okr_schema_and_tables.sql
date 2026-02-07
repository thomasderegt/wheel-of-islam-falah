-- =====================================================
-- Flyway Migration V17: Create Goals OKR Schema and Tables
-- =====================================================
-- Creates the goals_okr schema and all OKR tables
-- Schema: goals_okr
-- Purpose: OKR (Objectives and Key Results) goal setting
-- =====================================================

-- Create schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS goals_okr;

-- Set search path to goals_okr schema
SET search_path TO goals_okr;

-- =====================================================
-- Table: objectives (templates)
-- Purpose: Inspiring, qualitative goals within a life domain
-- =====================================================
CREATE TABLE IF NOT EXISTS goals_okr.objectives (
    id BIGSERIAL PRIMARY KEY,
    life_domain_id BIGINT NOT NULL, -- FK to goals.life_domains (shared schema)
    title_nl VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    description_nl TEXT,
    description_en TEXT,
    order_index INTEGER NOT NULL, -- Order within the life domain
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_objective_domain FOREIGN KEY (life_domain_id)
        REFERENCES goals.life_domains(id) ON DELETE CASCADE,
    CONSTRAINT uk_objective_domain_order UNIQUE (life_domain_id, order_index)
);

-- Indexes for objectives
CREATE INDEX IF NOT EXISTS idx_objectives_domain ON goals_okr.objectives(life_domain_id);
CREATE INDEX IF NOT EXISTS idx_objectives_order ON goals_okr.objectives(life_domain_id, order_index);

-- =====================================================
-- Table: key_results (templates)
-- Purpose: Measurable results that indicate success of an Objective
-- =====================================================
CREATE TABLE IF NOT EXISTS goals_okr.key_results (
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
    CONSTRAINT chk_key_result_target_value CHECK (target_value > 0)
);

-- Indexes for key_results
CREATE INDEX IF NOT EXISTS idx_key_results_objective ON goals_okr.key_results(objective_id);
CREATE INDEX IF NOT EXISTS idx_key_results_order ON goals_okr.key_results(objective_id, order_index);

-- =====================================================
-- Table: user_objective_instances (user-specific)
-- Purpose: User-specific instance of an Objective template
-- =====================================================
CREATE TABLE IF NOT EXISTS goals_okr.user_objective_instances (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL, -- Soft reference to users.users
    objective_id BIGINT NOT NULL, -- FK to goals_okr.objectives (template)
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    CONSTRAINT fk_user_objective_instance_objective FOREIGN KEY (objective_id)
        REFERENCES goals_okr.objectives(id) ON DELETE CASCADE,
    CONSTRAINT uk_user_objective UNIQUE (user_id, objective_id) -- One instance per user per objective
);

-- Indexes for user_objective_instances
CREATE INDEX IF NOT EXISTS idx_user_objective_instances_user ON goals_okr.user_objective_instances(user_id);
CREATE INDEX IF NOT EXISTS idx_user_objective_instances_objective ON goals_okr.user_objective_instances(objective_id);

-- =====================================================
-- Table: initiatives (user-specific)
-- Purpose: Concrete actions/tasks to achieve a Key Result
-- =====================================================
CREATE TABLE IF NOT EXISTS goals_okr.initiatives (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL, -- Soft reference to users.users
    key_result_id BIGINT NOT NULL, -- FK to goals_okr.key_results (template)
    user_objective_instance_id BIGINT NOT NULL, -- FK to goals_okr.user_objective_instances
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, COMPLETED, ARCHIVED
    target_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_initiative_key_result FOREIGN KEY (key_result_id)
        REFERENCES goals_okr.key_results(id) ON DELETE CASCADE,
    CONSTRAINT fk_initiative_user_instance FOREIGN KEY (user_objective_instance_id)
        REFERENCES goals_okr.user_objective_instances(id) ON DELETE CASCADE,
    CONSTRAINT chk_initiative_status CHECK (status IN ('ACTIVE', 'COMPLETED', 'ARCHIVED'))
);

-- Indexes for initiatives
CREATE INDEX IF NOT EXISTS idx_initiatives_user ON goals_okr.initiatives(user_id);
CREATE INDEX IF NOT EXISTS idx_initiatives_key_result ON goals_okr.initiatives(key_result_id);
CREATE INDEX IF NOT EXISTS idx_initiatives_user_instance ON goals_okr.initiatives(user_objective_instance_id);
CREATE INDEX IF NOT EXISTS idx_initiatives_status ON goals_okr.initiatives(status);

-- =====================================================
-- Table: key_result_progress (user-specific)
-- Purpose: Progress tracking for a Key Result
-- =====================================================
CREATE TABLE IF NOT EXISTS goals_okr.key_result_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL, -- Soft reference to users.users
    key_result_id BIGINT NOT NULL, -- FK to goals_okr.key_results (template)
    user_objective_instance_id BIGINT NOT NULL, -- FK to goals_okr.user_objective_instances
    current_value DECIMAL(10,2), -- Current progress value (can be null, must be >= 0 if set)
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_progress_key_result FOREIGN KEY (key_result_id)
        REFERENCES goals_okr.key_results(id) ON DELETE CASCADE,
    CONSTRAINT fk_progress_user_instance FOREIGN KEY (user_objective_instance_id)
        REFERENCES goals_okr.user_objective_instances(id) ON DELETE CASCADE,
    CONSTRAINT uk_user_key_result_instance UNIQUE (user_id, key_result_id, user_objective_instance_id),
    CONSTRAINT chk_progress_current_value CHECK (current_value IS NULL OR current_value >= 0)
);

-- Indexes for key_result_progress
CREATE INDEX IF NOT EXISTS idx_progress_user ON goals_okr.key_result_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_key_result ON goals_okr.key_result_progress(key_result_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_instance ON goals_okr.key_result_progress(user_objective_instance_id);

-- Reset search path
RESET search_path;
