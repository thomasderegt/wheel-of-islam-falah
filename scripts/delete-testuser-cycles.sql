-- Delete all Falah cycles and priority assessments for test user (test@test1.com)
-- Run: psql -d woi_backend_v2 -f scripts/delete-testuser-cycles.sql

DO $$
DECLARE
    v_user_id BIGINT;
    v_cycles_deleted INT;
    v_assessments_deleted INT;
BEGIN
    SELECT id INTO v_user_id FROM users.users WHERE email = 'test@test1.com';
    IF v_user_id IS NULL THEN
        RAISE NOTICE 'User test@test1.com not found';
        RETURN;
    END IF;

    WITH deleted AS (
        DELETE FROM users.priority_assessment WHERE user_id = v_user_id
        RETURNING id
    )
    SELECT COUNT(*)::INT INTO v_assessments_deleted FROM deleted;

    WITH deleted AS (
        DELETE FROM users.falah_cycle WHERE user_id = v_user_id
        RETURNING id
    )
    SELECT COUNT(*)::INT INTO v_cycles_deleted FROM deleted;

    RAISE NOTICE 'Deleted % priority assessment(s) and % Falah cycle(s) for test@test1.com',
        v_assessments_deleted, v_cycles_deleted;
END $$;
