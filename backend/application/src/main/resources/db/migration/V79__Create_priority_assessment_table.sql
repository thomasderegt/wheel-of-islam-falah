-- =====================================================
-- Flyway Migration V79: Create Priority Assessment Table
-- =====================================================
-- Stores user priority scores per wheel (Falah, Life, Business, Work)
-- Optionally linked to a Falah cycle
-- Schema: users
-- =====================================================

SET search_path TO users;

CREATE TABLE IF NOT EXISTS users.priority_assessment (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    falah_cycle_id BIGINT,
    scores_json JSONB NOT NULL DEFAULT '{}',
    skipped_wheels_json JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_priority_assessment_user FOREIGN KEY (user_id)
        REFERENCES users.users(id) ON DELETE CASCADE,
    CONSTRAINT fk_priority_assessment_cycle FOREIGN KEY (falah_cycle_id)
        REFERENCES users.falah_cycle(id) ON DELETE SET NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_priority_assessment_user_cycle
    ON users.priority_assessment(user_id, falah_cycle_id) WHERE falah_cycle_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_priority_assessment_user_standalone
    ON users.priority_assessment(user_id) WHERE falah_cycle_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_priority_assessment_user_id ON users.priority_assessment(user_id);
CREATE INDEX IF NOT EXISTS idx_priority_assessment_cycle_id ON users.priority_assessment(falah_cycle_id);

COMMENT ON TABLE users.priority_assessment IS 'User priority scores per wheel, optionally linked to a Falah cycle';
COMMENT ON COLUMN users.priority_assessment.scores_json IS 'JSON object: key=prefix:id (e.g. falah:0, life:1), value=1..N';
COMMENT ON COLUMN users.priority_assessment.skipped_wheels_json IS 'JSON array of skipped wheel prefixes: falah, life, business, work';

RESET search_path;
