-- =====================================================
-- Flyway Migration V40: Create User Preferences Table
-- =====================================================
-- Creates the user_preferences table for storing user mode and context preferences
-- Schema: users
-- =====================================================

-- Set search path to users schema
SET search_path TO users;

-- =====================================================
-- Table: user_preferences
-- Purpose: User-specific preferences and settings (mode and context)
-- =====================================================
CREATE TABLE IF NOT EXISTS users.user_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    default_mode VARCHAR(20) NOT NULL DEFAULT 'SUCCESS',
    default_context VARCHAR(20) NOT NULL DEFAULT 'SUCCESS',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_preferences_user FOREIGN KEY (user_id) 
        REFERENCES users.users(id) ON DELETE CASCADE,
    CONSTRAINT chk_default_mode CHECK (default_mode IN ('SUCCESS', 'GOAL', 'EXECUTE', 'INSIGHT')),
    CONSTRAINT chk_default_context CHECK (default_context IN ('SUCCESS', 'LIFE', 'BUSINESS', 'WORK'))
);

-- Index for user_id lookups
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON users.user_preferences(user_id);

COMMENT ON TABLE users.user_preferences IS 'User-specific preferences and settings';
COMMENT ON COLUMN users.user_preferences.user_id IS 'User ID - FK to users.users';
COMMENT ON COLUMN users.user_preferences.default_mode IS 'Default navigation mode: SUCCESS, GOAL, EXECUTE, or INSIGHT';
COMMENT ON COLUMN users.user_preferences.default_context IS 'Default context: SUCCESS (Wheel of Islam), LIFE, BUSINESS, or WORK';

-- Reset search path
RESET search_path;
