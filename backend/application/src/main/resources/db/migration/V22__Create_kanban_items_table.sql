-- =====================================================
-- Flyway Migration V22: Create Kanban Items Table
-- =====================================================
-- Creates kanban_items table for user kanban boards
-- Schema: goals_okr
-- Purpose: Allow users to add goals, objectives, key results, and initiatives to a kanban board
-- =====================================================

-- Set search path to goals_okr schema
SET search_path TO goals_okr;

-- =====================================================
-- Table: kanban_items
-- Purpose: User kanban board items (goals, objectives, key results, initiatives)
-- =====================================================
CREATE TABLE IF NOT EXISTS goals_okr.kanban_items (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL, -- Soft reference to users.users (no FK)
    item_type VARCHAR(50) NOT NULL, -- 'GOAL', 'OBJECTIVE', 'KEY_RESULT', 'INITIATIVE'
    item_id BIGINT NOT NULL, -- ID van het geselecteerde item
    column_name VARCHAR(50) NOT NULL DEFAULT 'TODO', -- 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'
    position INTEGER NOT NULL DEFAULT 0, -- Volgorde binnen de kolom
    notes TEXT, -- Optionele notities voor het item
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_user_item UNIQUE (user_id, item_type, item_id) -- Eén item per type per gebruiker
);

-- Indexes for kanban_items
CREATE INDEX IF NOT EXISTS idx_kanban_user ON goals_okr.kanban_items(user_id);
CREATE INDEX IF NOT EXISTS idx_kanban_column ON goals_okr.kanban_items(user_id, column_name);
CREATE INDEX IF NOT EXISTS idx_kanban_type ON goals_okr.kanban_items(item_type, item_id);

-- =====================================================
-- Comments
-- =====================================================
COMMENT ON TABLE goals_okr.kanban_items IS 'User kanban board items for tracking OKR progress';
COMMENT ON COLUMN goals_okr.kanban_items.item_type IS 'Type of item: GOAL, OBJECTIVE, KEY_RESULT, or INITIATIVE';
COMMENT ON COLUMN goals_okr.kanban_items.column_name IS 'Kanban column: TODO, IN_PROGRESS, IN_REVIEW, or DONE';
COMMENT ON COLUMN goals_okr.kanban_items.position IS 'Position/order within the column (0-based)';
