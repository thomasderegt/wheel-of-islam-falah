-- Flyway Migration V65: Objectives - created_by_user_id for custom objectives
-- NULL = template objective, user_id = custom objective created by user
-- Users only see templates + their own custom objectives

ALTER TABLE goals_okr.objectives
    ADD COLUMN IF NOT EXISTS created_by_user_id BIGINT;

COMMENT ON COLUMN goals_okr.objectives.created_by_user_id IS 'NULL = template objective, user_id = custom objective created by user';

CREATE INDEX IF NOT EXISTS idx_objectives_created_by_user ON goals_okr.objectives(created_by_user_id);
