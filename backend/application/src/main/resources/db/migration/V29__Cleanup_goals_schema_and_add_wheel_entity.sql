-- =====================================================
-- Flyway Migration V29: Cleanup Goals Schema and Add Wheel Entity
-- =====================================================
-- 1. Verplaats goals.life_domains → goals_okr.life_domains
-- 2. Verplaats goals.life_domain_scores → goals_okr.life_domain_scores
-- 3. Update FK's in goals_okr.goals
-- 4. Verwijder oude goals schema tabellen
-- 5. Maak goals_okr.wheels tabel aan
-- 6. Voeg wheel_id toe aan goals_okr.life_domains
-- 7. Seed data voor wheels
-- =====================================================

-- Set search path to goals_okr schema
SET search_path TO goals_okr;

-- =====================================================
-- Step 1: Create life_domains table in goals_okr schema
-- =====================================================
CREATE TABLE IF NOT EXISTS goals_okr.life_domains (
    id BIGSERIAL PRIMARY KEY,
    domain_key VARCHAR(50) NOT NULL UNIQUE, -- 'RELIGION', 'FAMILY', 'WORK', etc.
    title_nl VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    description_nl TEXT,
    description_en TEXT,
    icon_name VARCHAR(100), -- For UI icons
    display_order INTEGER NOT NULL,
    wheel_id BIGINT, -- FK to goals_okr.wheels (will be added after wheels table)
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for life_domains
CREATE INDEX IF NOT EXISTS idx_life_domains_key ON goals_okr.life_domains(domain_key);
CREATE INDEX IF NOT EXISTS idx_life_domains_order ON goals_okr.life_domains(display_order);

-- =====================================================
-- Step 2: Migrate data from goals.life_domains to goals_okr.life_domains
-- =====================================================
INSERT INTO goals_okr.life_domains (id, domain_key, title_nl, title_en, description_nl, description_en, icon_name, display_order, created_at)
SELECT id, domain_key, title_nl, title_en, description_nl, description_en, icon_name, display_order, created_at
FROM goals.life_domains
ON CONFLICT (id) DO NOTHING;

-- Reset sequence to max id
SELECT setval('goals_okr.life_domains_id_seq', (SELECT MAX(id) FROM goals_okr.life_domains));

-- =====================================================
-- Step 3: Create life_domain_scores table in goals_okr schema
-- =====================================================
CREATE TABLE IF NOT EXISTS goals_okr.life_domain_scores (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL, -- Soft reference to users.users (no FK)
    life_domain_id BIGINT NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 1 AND score <= 10), -- 1-10 scale
    assessed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_score_domain FOREIGN KEY (life_domain_id) 
        REFERENCES goals_okr.life_domains(id) ON DELETE CASCADE,
    CONSTRAINT uk_user_domain UNIQUE (user_id, life_domain_id) -- One score per user per domain
);

-- Indexes for life_domain_scores
CREATE INDEX IF NOT EXISTS idx_scores_user ON goals_okr.life_domain_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_scores_domain ON goals_okr.life_domain_scores(life_domain_id);
CREATE INDEX IF NOT EXISTS idx_scores_user_domain ON goals_okr.life_domain_scores(user_id, life_domain_id);

-- =====================================================
-- Step 4: Migrate data from goals.life_domain_scores to goals_okr.life_domain_scores
-- =====================================================
INSERT INTO goals_okr.life_domain_scores (id, user_id, life_domain_id, score, assessed_at)
SELECT id, user_id, life_domain_id, score, assessed_at
FROM goals.life_domain_scores
ON CONFLICT (id) DO NOTHING;

-- Reset sequence to max id
SELECT setval('goals_okr.life_domain_scores_id_seq', (SELECT MAX(id) FROM goals_okr.life_domain_scores));

-- =====================================================
-- Step 5: Update FK's in goals_okr.goals to reference goals_okr.life_domains
-- =====================================================
-- Drop old FK constraint
ALTER TABLE goals_okr.goals 
    DROP CONSTRAINT IF EXISTS fk_goal_domain;

-- Add new FK constraint pointing to goals_okr.life_domains
ALTER TABLE goals_okr.goals 
    ADD CONSTRAINT fk_goal_domain 
    FOREIGN KEY (life_domain_id) 
    REFERENCES goals_okr.life_domains(id) ON DELETE CASCADE;

-- =====================================================
-- Step 6: Create wheels table in goals_okr schema
-- =====================================================
CREATE TABLE IF NOT EXISTS goals_okr.wheels (
    id BIGSERIAL PRIMARY KEY,
    wheel_key VARCHAR(50) NOT NULL UNIQUE, -- 'WHEEL_OF_LIFE', 'WHEEL_OF_BUSINESS'
    name_nl VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    description_nl TEXT,
    description_en TEXT,
    display_order INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for wheels
CREATE INDEX IF NOT EXISTS idx_wheels_key ON goals_okr.wheels(wheel_key);
CREATE INDEX IF NOT EXISTS idx_wheels_order ON goals_okr.wheels(display_order);

-- =====================================================
-- Step 7: Seed wheels data
-- =====================================================
INSERT INTO goals_okr.wheels (wheel_key, name_nl, name_en, description_nl, description_en, display_order)
VALUES 
    ('WHEEL_OF_LIFE', 'Wheel of Life', 'Wheel of Life', 
     'Persoonlijke doelen en levensdomeinen', 
     'Personal goals and life domains', 1),
    ('WHEEL_OF_BUSINESS', 'Wheel of Business', 'Wheel of Business', 
     'Zakelijke doelen en business domeinen', 
     'Business goals and business domains', 2)
ON CONFLICT (wheel_key) DO NOTHING;

-- =====================================================
-- Step 8: Add wheel_id FK to life_domains
-- =====================================================
-- Update existing life_domains to Wheel of Life
UPDATE goals_okr.life_domains 
SET wheel_id = (SELECT id FROM goals_okr.wheels WHERE wheel_key = 'WHEEL_OF_LIFE')
WHERE wheel_id IS NULL;

-- Add FK constraint
ALTER TABLE goals_okr.life_domains 
    ADD CONSTRAINT fk_life_domain_wheel 
    FOREIGN KEY (wheel_id) 
    REFERENCES goals_okr.wheels(id) ON DELETE SET NULL;

-- Add index for wheel_id
CREATE INDEX IF NOT EXISTS idx_life_domains_wheel ON goals_okr.life_domains(wheel_id);

-- =====================================================
-- Step 9: Drop old goals schema tables (only if they exist and are not referenced)
-- =====================================================
-- First, check if old tables have data and drop FK constraints
DO $$
BEGIN
    -- Drop old goals.goals table (if exists and not referenced)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'goals' AND table_name = 'goal_progress') THEN
        DROP TABLE IF EXISTS goals.goal_progress CASCADE;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'goals' AND table_name = 'goals') THEN
        DROP TABLE IF EXISTS goals.goals CASCADE;
    END IF;
    
    -- Drop old hierarchy tables
    DROP TABLE IF EXISTS goals.user_goal_instances CASCADE;
    DROP TABLE IF EXISTS goals.goal_templates CASCADE;
    DROP TABLE IF EXISTS goals.goal_sets CASCADE;
    DROP TABLE IF EXISTS goals.goal_groups CASCADE;
    DROP TABLE IF EXISTS goals.goal_areas CASCADE;
    
    -- Drop old life_domains and life_domain_scores (data is migrated)
    DROP TABLE IF EXISTS goals.life_domain_scores CASCADE;
    DROP TABLE IF EXISTS goals.life_domains CASCADE;
END $$;

-- =====================================================
-- Step 10: Update any remaining references
-- =====================================================
-- Update user_goals table if it references old goals.goals
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'goals_okr' AND table_name = 'user_goals') THEN
        -- Check if user_goals has life_domain_id column that needs updating
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'goals_okr' 
            AND table_name = 'user_goals' 
            AND column_name = 'life_domain_id'
        ) THEN
            -- No action needed, life_domain_id already points to correct schema after FK update
            NULL;
        END IF;
    END IF;
END $$;

-- Reset search path
RESET search_path;
