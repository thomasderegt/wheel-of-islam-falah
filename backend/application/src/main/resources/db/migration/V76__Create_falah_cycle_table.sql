-- =====================================================
-- Flyway Migration V76: Create Falah Cycle Table
-- =====================================================
-- Creates the falah_cycle table for tracking user Falah growth cycles
-- Schema: users
-- =====================================================

-- Set search path to users schema
SET search_path TO users;

-- =====================================================
-- Table: falah_cycle
-- Purpose: Track user Falah growth cycles (Falah → Assessment → Goals → Execute → Insight → repeat)
-- =====================================================
CREATE TABLE IF NOT EXISTS users.falah_cycle (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    CONSTRAINT fk_falah_cycle_user FOREIGN KEY (user_id)
        REFERENCES users.users(id) ON DELETE CASCADE
);

-- Index for user_id lookups (active cycles, history)
CREATE INDEX IF NOT EXISTS idx_falah_cycle_user_id ON users.falah_cycle(user_id);
CREATE INDEX IF NOT EXISTS idx_falah_cycle_user_started ON users.falah_cycle(user_id, started_at DESC);

COMMENT ON TABLE users.falah_cycle IS 'Falah growth cycles per user - tracks started and completed cycles';
COMMENT ON COLUMN users.falah_cycle.user_id IS 'User ID - FK to users.users';
COMMENT ON COLUMN users.falah_cycle.started_at IS 'When the cycle was started';
COMMENT ON COLUMN users.falah_cycle.completed_at IS 'When the cycle was completed (null = active/running)';

-- Reset search path
RESET search_path;
