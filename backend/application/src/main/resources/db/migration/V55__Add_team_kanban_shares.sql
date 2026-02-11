-- =====================================================
-- Flyway Migration V55: Add Team Kanban Shares
-- =====================================================
-- Adds team kanban sharing functionality:
-- - Team owners can share their kanban board with team members
-- - Team members can view (read-only) the owner's kanban board
-- Schema: users
-- =====================================================

SET search_path TO users;

-- =====================================================
-- Table: team_kanban_shares
-- Purpose: Track which teams have shared kanban boards
-- =====================================================
CREATE TABLE IF NOT EXISTS users.team_kanban_shares (
    id BIGSERIAL PRIMARY KEY,
    team_id BIGINT NOT NULL,
    owner_user_id BIGINT NOT NULL, -- User die het board deelt (moet team owner zijn)
    shared_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    unshared_at TIMESTAMP, -- NULL = actief gedeeld, TIMESTAMP = unshared
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_team_kanban_share_team FOREIGN KEY (team_id) 
        REFERENCES users.teams(id) ON DELETE CASCADE,
    CONSTRAINT fk_team_kanban_share_owner FOREIGN KEY (owner_user_id) 
        REFERENCES users.users(id) ON DELETE CASCADE,
    CONSTRAINT uk_team_kanban_share UNIQUE (team_id, owner_user_id) -- Eén share per team per owner
);

CREATE INDEX IF NOT EXISTS idx_team_kanban_shares_team ON users.team_kanban_shares(team_id);
CREATE INDEX IF NOT EXISTS idx_team_kanban_shares_owner ON users.team_kanban_shares(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_team_kanban_shares_active ON users.team_kanban_shares(team_id, unshared_at) 
    WHERE unshared_at IS NULL; -- Partial index voor actieve shares

-- Comments for documentation
COMMENT ON TABLE users.team_kanban_shares IS 'Tracks which teams have shared kanban boards. Only team owners can share their board. Team members can view (read-only).';

RESET search_path;
