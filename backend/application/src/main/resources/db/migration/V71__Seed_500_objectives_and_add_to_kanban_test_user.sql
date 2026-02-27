-- =====================================================
-- Flyway Migration V71: Seed 500 Objectives and Add to Kanban for test@test1.com
-- =====================================================
-- 1. Inserts 50 objectives per life domain (Wheel of Life) = 500 total
-- 2. Creates user_objective_instances and kanban_items for test@test1.com
-- =====================================================

SET search_path TO goals_okr;

-- 1. Insert 50 objectives per life domain (Wheel of Life) = 500 total
INSERT INTO goals_okr.objectives (life_domain_id, title_nl, title_en, order_index, created_by_user_id)
SELECT
    ld.id,
    'Perf test objective ' || gs.i,
    'Perf test objective ' || gs.i,
    gs.i,
    NULL
FROM goals_okr.life_domains ld
CROSS JOIN generate_series(1, 50) gs(i)
WHERE ld.wheel_id = (SELECT id FROM goals_okr.wheels WHERE wheel_key = 'WHEEL_OF_LIFE');

-- 2. Add user_objective_instances and kanban_items for test@test1.com
DO $$
DECLARE
    v_user_id BIGINT;
BEGIN
    SELECT id INTO v_user_id FROM users.users WHERE email = 'test@test1.com';
    IF v_user_id IS NULL THEN
        RAISE NOTICE 'User test@test1.com not found, skipping kanban seed';
        RETURN;
    END IF;

    -- Create user_objective_instances for all perf test objectives
    INSERT INTO goals_okr.user_objective_instances (user_id, objective_id, number)
    SELECT v_user_id, o.id, 'OBJ-SUB-' || nextval('goals_okr.seq_user_objective_instance_number')
    FROM goals_okr.objectives o
    WHERE o.title_nl LIKE 'Perf test objective %'
      AND NOT EXISTS (
          SELECT 1 FROM goals_okr.user_objective_instances uoi
          WHERE uoi.user_id = v_user_id AND uoi.objective_id = o.id
      );

    -- Create kanban_items for each user_objective_instance
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

RESET search_path;
