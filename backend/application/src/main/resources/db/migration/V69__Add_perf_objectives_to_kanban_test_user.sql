-- =====================================================
-- Flyway Migration V69: Add Perf Objectives to Kanban for test@test1.com
-- =====================================================
-- Creates user_objective_instances and kanban_items for all perf test objectives
-- for user test@test1.com. Idempotent: skips if user not found or already done.
-- =====================================================

DO $$
DECLARE
    v_user_id BIGINT;
BEGIN
    SELECT id INTO v_user_id FROM users.users WHERE email = 'test@test1.com';
    IF v_user_id IS NULL THEN
        RAISE NOTICE 'User test@test1.com not found, skipping V69';
        RETURN;
    END IF;

    -- Skip if already done (user has kanban items for perf objectives)
    IF EXISTS (
        SELECT 1 FROM goals_okr.kanban_items ki
        JOIN goals_okr.user_objective_instances uoi ON uoi.id = ki.item_id AND ki.item_type = 'OBJECTIVE'
        JOIN goals_okr.objectives o ON o.id = uoi.objective_id
        WHERE ki.user_id = v_user_id AND o.title_nl LIKE 'Perf test objective %'
        LIMIT 1
    ) THEN
        RAISE NOTICE 'Perf objectives already on kanban for test@test1.com, skipping V69';
        RETURN;
    END IF;

    -- 1. Create user_objective_instances for perf test objectives (skip if already exists)
    INSERT INTO goals_okr.user_objective_instances (user_id, objective_id, number)
    SELECT v_user_id, o.id, 'OBJ-SUB-' || nextval('goals_okr.seq_user_objective_instance_number')
    FROM goals_okr.objectives o
    WHERE o.title_nl LIKE 'Perf test objective %'
      AND NOT EXISTS (
          SELECT 1 FROM goals_okr.user_objective_instances uoi
          WHERE uoi.user_id = v_user_id AND uoi.objective_id = o.id
      );

    -- 2. Create kanban_items for each user_objective_instance (OBJECTIVE type, item_id = uoi.id)
    INSERT INTO goals_okr.kanban_items (user_id, item_type, item_id, column_name, position, number)
    SELECT v_user_id, 'OBJECTIVE', uoi.id, 'TODO', row_number() OVER () - 1,
           'KANBAN-' || nextval('goals_okr.seq_kanban_item_number')
    FROM goals_okr.user_objective_instances uoi
    JOIN goals_okr.objectives o ON o.id = uoi.objective_id
    WHERE uoi.user_id = v_user_id AND o.title_nl LIKE 'Perf test objective %'
      AND NOT EXISTS (
          SELECT 1 FROM goals_okr.kanban_items ki
          WHERE ki.user_id = v_user_id AND ki.item_type = 'OBJECTIVE' AND ki.item_id = uoi.id
      );

END $$;
