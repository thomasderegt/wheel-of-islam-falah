-- =====================================================
-- Flyway Migration V54: Add Teams to User Module
-- =====================================================
-- Adds team functionality to the user module:
-- - Teams table
-- - Team members table
-- - Team invitations table
-- Schema: users
-- =====================================================

SET search_path TO users;

-- =====================================================
-- Table: teams
-- Purpose: Team entities for collaboration
-- =====================================================
CREATE TABLE IF NOT EXISTS users.teams (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id BIGINT NOT NULL, -- FK to users.users (team creator/owner)
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, ARCHIVED
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_team_owner FOREIGN KEY (owner_id) 
        REFERENCES users.users(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_teams_owner ON users.teams(owner_id);
CREATE INDEX IF NOT EXISTS idx_teams_status ON users.teams(status);

-- =====================================================
-- Table: team_members
-- Purpose: Team membership with roles
-- =====================================================
CREATE TABLE IF NOT EXISTS users.team_members (
    id BIGSERIAL PRIMARY KEY,
    team_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    role VARCHAR(50) NOT NULL, -- OWNER, ADMIN, MEMBER
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, INVITED, LEFT
    invited_by_id BIGINT, -- FK to users.users (who invited this member)
    joined_at TIMESTAMP,
    left_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_team_member_team FOREIGN KEY (team_id) 
        REFERENCES users.teams(id) ON DELETE CASCADE,
    CONSTRAINT fk_team_member_user FOREIGN KEY (user_id) 
        REFERENCES users.users(id) ON DELETE CASCADE,
    CONSTRAINT fk_team_member_inviter FOREIGN KEY (invited_by_id) 
        REFERENCES users.users(id) ON DELETE SET NULL,
    CONSTRAINT uk_team_member UNIQUE (team_id, user_id) -- One membership per user per team
);

CREATE INDEX IF NOT EXISTS idx_team_members_team ON users.team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON users.team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_status ON users.team_members(status);

-- =====================================================
-- Table: team_invitations
-- Purpose: Pending team invitations
-- =====================================================
CREATE TABLE IF NOT EXISTS users.team_invitations (
    id BIGSERIAL PRIMARY KEY,
    team_id BIGINT NOT NULL,
    email VARCHAR(255) NOT NULL, -- Email of invited user (may not exist yet)
    role VARCHAR(50) NOT NULL DEFAULT 'MEMBER', -- Role to assign when accepted
    invited_by_id BIGINT NOT NULL, -- FK to users.users
    token VARCHAR(255) NOT NULL UNIQUE, -- Unique invitation token
    expires_at TIMESTAMP NOT NULL,
    accepted_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_invitation_team FOREIGN KEY (team_id) 
        REFERENCES users.teams(id) ON DELETE CASCADE,
    CONSTRAINT fk_invitation_inviter FOREIGN KEY (invited_by_id) 
        REFERENCES users.users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_team_invitations_team ON users.team_invitations(team_id);
CREATE INDEX IF NOT EXISTS idx_team_invitations_email ON users.team_invitations(email);
CREATE INDEX IF NOT EXISTS idx_team_invitations_token ON users.team_invitations(token);
CREATE INDEX IF NOT EXISTS idx_team_invitations_expires ON users.team_invitations(expires_at);

-- Comments for documentation
COMMENT ON TABLE users.teams IS 'Teams for collaboration. Each team has an owner who can manage the team.';
COMMENT ON TABLE users.team_members IS 'Team membership with roles. Tracks who is in which team and their role.';
COMMENT ON TABLE users.team_invitations IS 'Pending team invitations. Users are invited by email and can accept via token.';

RESET search_path;
