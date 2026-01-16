-- =====================================================
-- Flyway Migration V1: User Module Schema and Tables
-- =====================================================
-- Creates the users schema and all user module tables
-- Schema: users
-- =====================================================

-- Create schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS users;

-- Set search path to users schema
SET search_path TO users;

-- =====================================================
-- Table: users
-- Purpose: Core user information (email, profile name, status)
-- =====================================================
CREATE TABLE IF NOT EXISTS users.users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    profile_name VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users.users(email);

-- =====================================================
-- Table: credentials
-- Purpose: Password hashes (separated for security)
-- =====================================================
CREATE TABLE IF NOT EXISTS users.credentials (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    password_updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_credentials_user FOREIGN KEY (user_id) 
        REFERENCES users.users(id) ON DELETE CASCADE
);

-- Index for user_id lookups
CREATE INDEX IF NOT EXISTS idx_credentials_user_id ON users.credentials(user_id);

-- =====================================================
-- Table: user_role_assignments
-- Purpose: User roles (USER, ADMIN, etc.)
-- =====================================================
CREATE TABLE IF NOT EXISTS users.user_role_assignments (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_role_assignments_user FOREIGN KEY (user_id) 
        REFERENCES users.users(id) ON DELETE CASCADE,
    CONSTRAINT uk_user_role UNIQUE (user_id, role)
);

-- Index for user_id lookups
CREATE INDEX IF NOT EXISTS idx_role_assignments_user_id ON users.user_role_assignments(user_id);

-- =====================================================
-- Table: refresh_tokens
-- Purpose: JWT refresh tokens for long-lived sessions
-- =====================================================
CREATE TABLE IF NOT EXISTS users.refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP,
    CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) 
        REFERENCES users.users(id) ON DELETE CASCADE
);

-- Indexes for refresh tokens
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON users.refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash ON users.refresh_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON users.refresh_tokens(expires_at);

-- =====================================================
-- Table: password_reset_tokens
-- Purpose: Password reset tokens (secure reset flow)
-- =====================================================
CREATE TABLE IF NOT EXISTS users.password_reset_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_password_reset_tokens_user FOREIGN KEY (user_id) 
        REFERENCES users.users(id) ON DELETE CASCADE
);

-- Indexes for password reset tokens
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON users.password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token_hash ON users.password_reset_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON users.password_reset_tokens(expires_at);

-- =====================================================
-- Table: audit_log
-- Purpose: Audit logging for security and compliance
-- =====================================================
CREATE TABLE IF NOT EXISTS users.audit_log (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    event_type VARCHAR(50) NOT NULL,
    event_status VARCHAR(20) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    details TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_log_user FOREIGN KEY (user_id) 
        REFERENCES users.users(id) ON DELETE SET NULL
);

-- Indexes for audit log
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON users.audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_event_type ON users.audit_log(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON users.audit_log(created_at);

-- =====================================================
-- Table: account_lockout
-- Purpose: Account lockout tracking (brute force protection)
-- =====================================================
CREATE TABLE IF NOT EXISTS users.account_lockout (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    failed_attempts INTEGER NOT NULL DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_account_lockout_user FOREIGN KEY (user_id) 
        REFERENCES users.users(id) ON DELETE CASCADE
);

-- Index for user_id lookups
CREATE INDEX IF NOT EXISTS idx_account_lockout_user_id ON users.account_lockout(user_id);

-- Reset search path
RESET search_path;

