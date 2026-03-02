-- =====================================================
-- Flyway Migration V77: Add flow_exited_at to falah_cycle
-- =====================================================
-- Tracks when user exited the cycle creation flow (Finish) without completing the cycle.
-- flow_exited_at = null: user is in the creation process (Back/Next, grayed nav)
-- flow_exited_at set: user exited via Finish, cycle still active until completed
-- =====================================================

SET search_path TO users;

ALTER TABLE users.falah_cycle
    ADD COLUMN IF NOT EXISTS flow_exited_at TIMESTAMP;

COMMENT ON COLUMN users.falah_cycle.flow_exited_at IS 'When user exited the creation flow via Finish (null = in flow)';

RESET search_path;
