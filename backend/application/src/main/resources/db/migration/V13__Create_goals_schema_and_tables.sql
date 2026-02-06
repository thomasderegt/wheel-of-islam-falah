-- =====================================================
-- Flyway Migration V13: Goals Module Schema and Tables
-- =====================================================
-- Creates the goals schema and all goals module tables
-- Schema: goals
-- Purpose: 360° goals, life domains, goal progress, and assessment scores
-- =====================================================

-- Create schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS goals;

-- Set search path to goals schema
SET search_path TO goals;

-- =====================================================
-- Table: life_domains
-- Purpose: Life domains for 360° wheel (Religie, Familie, Werk, etc.)
-- =====================================================
CREATE TABLE IF NOT EXISTS goals.life_domains (
    id BIGSERIAL PRIMARY KEY,
    domain_key VARCHAR(50) NOT NULL UNIQUE, -- 'RELIGION', 'FAMILY', 'WORK', etc.
    title_nl VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    description_nl TEXT,
    description_en TEXT,
    icon_name VARCHAR(100), -- For UI icons
    display_order INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for domain_key lookups
CREATE INDEX IF NOT EXISTS idx_life_domains_key ON goals.life_domains(domain_key);
CREATE INDEX IF NOT EXISTS idx_life_domains_order ON goals.life_domains(display_order);

-- =====================================================
-- Table: goals
-- Purpose: User-specific goals per life domain
-- =====================================================
CREATE TABLE IF NOT EXISTS goals.goals (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL, -- Soft reference to users.users (no FK)
    life_domain_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, COMPLETED, ARCHIVED
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_goal_domain FOREIGN KEY (life_domain_id) 
        REFERENCES goals.life_domains(id) ON DELETE CASCADE
);

-- Indexes for goals
CREATE INDEX IF NOT EXISTS idx_goals_user ON goals.goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_domain ON goals.goals(life_domain_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON goals.goals(status);
CREATE INDEX IF NOT EXISTS idx_goals_user_domain ON goals.goals(user_id, life_domain_id);

-- =====================================================
-- Table: goal_progress
-- Purpose: Progress tracking per goal
-- =====================================================
CREATE TABLE IF NOT EXISTS goals.goal_progress (
    id BIGSERIAL PRIMARY KEY,
    goal_id BIGINT NOT NULL,
    progress_percentage INTEGER NOT NULL DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    notes TEXT,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_progress_goal FOREIGN KEY (goal_id) 
        REFERENCES goals.goals(id) ON DELETE CASCADE,
    CONSTRAINT uk_goal_progress UNIQUE (goal_id) -- One progress record per goal
);

-- Index for goal_progress
CREATE INDEX IF NOT EXISTS idx_progress_goal ON goals.goal_progress(goal_id);

-- =====================================================
-- Table: life_domain_scores
-- Purpose: 360° assessment scores (current state per domain)
-- =====================================================
CREATE TABLE IF NOT EXISTS goals.life_domain_scores (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL, -- Soft reference to users.users (no FK)
    life_domain_id BIGINT NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 1 AND score <= 10), -- 1-10 scale
    assessed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_score_domain FOREIGN KEY (life_domain_id) 
        REFERENCES goals.life_domains(id) ON DELETE CASCADE,
    CONSTRAINT uk_user_domain UNIQUE (user_id, life_domain_id) -- One score per user per domain
);

-- Indexes for life_domain_scores
CREATE INDEX IF NOT EXISTS idx_scores_user ON goals.life_domain_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_scores_domain ON goals.life_domain_scores(life_domain_id);
CREATE INDEX IF NOT EXISTS idx_scores_user_domain ON goals.life_domain_scores(user_id, life_domain_id);

-- Reset search path
RESET search_path;
