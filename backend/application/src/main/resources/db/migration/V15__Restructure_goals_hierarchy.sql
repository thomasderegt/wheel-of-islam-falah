-- =====================================================
-- Flyway Migration V15: Restructure Goals Hierarchy
-- =====================================================
-- Restructures goals module to match content hierarchy:
-- Life Domain → Goal Area → Goal Group → Goal Set → Individual Goal
-- Templates (shared) + User Goals (user-specific)
-- =====================================================

-- Set search path to goals schema
SET search_path TO goals;

-- =====================================================
-- Table: goal_areas (templates)
-- Purpose: Goal areas within a life domain (like Book in content)
-- =====================================================
CREATE TABLE IF NOT EXISTS goals.goal_areas (
    id BIGSERIAL PRIMARY KEY,
    life_domain_id BIGINT NOT NULL,
    title_nl VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    description_nl TEXT,
    description_en TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_goal_area_domain FOREIGN KEY (life_domain_id) 
        REFERENCES goals.life_domains(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_goal_areas_domain ON goals.goal_areas(life_domain_id);
CREATE INDEX IF NOT EXISTS idx_goal_areas_order ON goals.goal_areas(life_domain_id, order_index);

-- =====================================================
-- Table: goal_groups (templates)
-- Purpose: Goal groups within a goal area (like Chapter in content)
-- =====================================================
CREATE TABLE IF NOT EXISTS goals.goal_groups (
    id BIGSERIAL PRIMARY KEY,
    goal_area_id BIGINT NOT NULL,
    title_nl VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    description_nl TEXT,
    description_en TEXT,
    position INTEGER NOT NULL DEFAULT 0, -- 0 = center, 1-10 = circular (like Chapter)
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_goal_group_area FOREIGN KEY (goal_area_id) 
        REFERENCES goals.goal_areas(id) ON DELETE CASCADE,
    CONSTRAINT chk_goal_group_position CHECK (position >= 0 AND position <= 10)
);

CREATE INDEX IF NOT EXISTS idx_goal_groups_area ON goals.goal_groups(goal_area_id);
CREATE INDEX IF NOT EXISTS idx_goal_groups_position ON goals.goal_groups(goal_area_id, position);

-- =====================================================
-- Table: goal_sets (templates)
-- Purpose: Goal sets within a goal group (like Section in content)
-- =====================================================
CREATE TABLE IF NOT EXISTS goals.goal_sets (
    id BIGSERIAL PRIMARY KEY,
    goal_group_id BIGINT NOT NULL,
    title_nl VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    description_nl TEXT,
    description_en TEXT,
    order_index INTEGER NOT NULL,
    target_date DATE, -- Optional target date for the entire set
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_goal_set_group FOREIGN KEY (goal_group_id) 
        REFERENCES goals.goal_groups(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_goal_sets_group ON goals.goal_sets(goal_group_id);
CREATE INDEX IF NOT EXISTS idx_goal_sets_order ON goals.goal_sets(goal_group_id, order_index);

-- =====================================================
-- Table: goal_templates (optional - for admin management)
-- Purpose: Complete goal template structure (like LearningFlowTemplate)
-- =====================================================
CREATE TABLE IF NOT EXISTS goals.goal_templates (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    life_domain_id BIGINT NOT NULL,
    created_by BIGINT NOT NULL, -- Soft reference to users.users
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_goal_template_domain FOREIGN KEY (life_domain_id) 
        REFERENCES goals.life_domains(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_goal_templates_domain ON goals.goal_templates(life_domain_id);
CREATE INDEX IF NOT EXISTS idx_goal_templates_created_by ON goals.goal_templates(created_by);

-- =====================================================
-- Update existing goals table to reference goal_set
-- =====================================================
-- First, add new column
ALTER TABLE goals.goals 
    ADD COLUMN IF NOT EXISTS goal_set_id BIGINT,
    ADD COLUMN IF NOT EXISTS goal_number INTEGER; -- Order within goal_set (like paragraph_number)

-- Add foreign key constraint
ALTER TABLE goals.goals
    ADD CONSTRAINT fk_goal_set FOREIGN KEY (goal_set_id) 
        REFERENCES goals.goal_sets(id) ON DELETE CASCADE;

-- Add index
CREATE INDEX IF NOT EXISTS idx_goals_set ON goals.goals(goal_set_id);
CREATE INDEX IF NOT EXISTS idx_goals_set_number ON goals.goals(goal_set_id, goal_number);

-- Keep life_domain_id for backward compatibility and direct queries
-- But goal_set_id is the primary relationship now

-- =====================================================
-- Table: user_goal_instances (user-specific goals)
-- Purpose: User instances of goals from templates (like LearningFlowEnrollment)
-- =====================================================
CREATE TABLE IF NOT EXISTS goals.user_goal_instances (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL, -- Soft reference to users.users
    goal_set_id BIGINT NOT NULL, -- Reference to template goal_set
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    CONSTRAINT fk_user_goal_instance_set FOREIGN KEY (goal_set_id) 
        REFERENCES goals.goal_sets(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_goal_instances_user ON goals.user_goal_instances(user_id);
CREATE INDEX IF NOT EXISTS idx_user_goal_instances_set ON goals.user_goal_instances(goal_set_id);
CREATE INDEX IF NOT EXISTS idx_user_goal_instances_user_set ON goals.user_goal_instances(user_id, goal_set_id);

-- =====================================================
-- Update goals table to link to user_goal_instance
-- =====================================================
ALTER TABLE goals.goals
    ADD COLUMN IF NOT EXISTS user_goal_instance_id BIGINT;

ALTER TABLE goals.goals
    ADD CONSTRAINT fk_goal_user_instance FOREIGN KEY (user_goal_instance_id) 
        REFERENCES goals.user_goal_instances(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_goals_user_instance ON goals.goals(user_goal_instance_id);

-- Reset search path
RESET search_path;
