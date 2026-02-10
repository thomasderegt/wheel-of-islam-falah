-- =====================================================
-- Flyway Migration V38: Add Quarter and Year to Goals
-- =====================================================
-- Adds Program Increment (PI) support via quarter and year fields
-- Structure: LifeDomain → Goal (with quarter/year) → Objective → KeyResult → Initiative
-- =====================================================

SET search_path TO goals_okr;

-- =====================================================
-- Add quarter and year columns to goals table
-- =====================================================
ALTER TABLE goals_okr.goals
    ADD COLUMN IF NOT EXISTS quarter INTEGER, -- 1-4 (Q1, Q2, Q3, Q4)
    ADD COLUMN IF NOT EXISTS year INTEGER;    -- e.g., 2025

-- Add check constraint for valid quarter values
ALTER TABLE goals_okr.goals
    ADD CONSTRAINT chk_goal_quarter CHECK (quarter IS NULL OR (quarter >= 1 AND quarter <= 4));

-- Add check constraint for valid year values
ALTER TABLE goals_okr.goals
    ADD CONSTRAINT chk_goal_year CHECK (year IS NULL OR year >= 2000);

-- Indexes for filtering/grouping by quarter and year
CREATE INDEX IF NOT EXISTS idx_goals_quarter_year ON goals_okr.goals(life_domain_id, year, quarter);
CREATE INDEX IF NOT EXISTS idx_goals_year ON goals_okr.goals(year);

-- =====================================================
-- Comments
-- =====================================================
COMMENT ON COLUMN goals_okr.goals.quarter IS 'Program Increment quarter (1-4) for organizing goals by time period';
COMMENT ON COLUMN goals_okr.goals.year IS 'Program Increment year (e.g., 2025) for organizing goals by time period';
