-- =====================================================
-- Flyway Migration V74: Seed 500 Objectives + 500 Key Results + 1000 Kanban Items
-- =====================================================
-- 1. 500 objectives (50 per life domain)
-- 2. 1 key result per objective = 500 key results
-- 3. user_objective_instances + user_key_result_instances for test@test1.com
-- 4. 1000 kanban items: 500 OBJECTIVE + 500 KEY_RESULT
-- =====================================================

SET search_path TO goals_okr;

-- 1. Insert 500 objectives (50 per life domain)
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

-- 2. Insert 1 key result per objective (500 key results)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, target_value, unit, order_index, created_by_user_id)
SELECT
    o.id,
    'Perf test KR for obj ' || o.id,
    'Perf test KR for obj ' || o.id,
    100.00,
    'percentage',
    1,
    NULL
FROM goals_okr.objectives o
WHERE o.title_nl LIKE 'Perf test objective %';

-- 3. User instances + kanban for test@test1.com
DO $$
DECLARE
    v_user_id BIGINT;
BEGIN
    SELECT id INTO v_user_id FROM users.users WHERE email = 'test@test1.com';
    IF v_user_id IS NULL THEN
        RAISE NOTICE 'User test@test1.com not found, skipping kanban seed';
        RETURN;
    END IF;

    -- 3a. user_objective_instances
    INSERT INTO goals_okr.user_objective_instances (user_id, objective_id, number)
    SELECT v_user_id, o.id, 'OBJ-SUB-' || nextval('goals_okr.seq_user_objective_instance_number')
    FROM goals_okr.objectives o
    WHERE o.title_nl LIKE 'Perf test objective %'
      AND NOT EXISTS (
          SELECT 1 FROM goals_okr.user_objective_instances uoi
          WHERE uoi.user_id = v_user_id AND uoi.objective_id = o.id
      );

    -- 3b. user_key_result_instances (1 per user_objective_instance)
    INSERT INTO goals_okr.user_key_result_instances (user_objective_instance_id, key_result_id, number)
    SELECT uoi.id, kr.id, 'KR-SUB-' || nextval('goals_okr.seq_user_key_result_instance_number')
    FROM goals_okr.user_objective_instances uoi
    JOIN goals_okr.objectives o ON o.id = uoi.objective_id
    JOIN goals_okr.key_results kr ON kr.objective_id = o.id
    WHERE uoi.user_id = v_user_id AND o.title_nl LIKE 'Perf test objective %'
      AND NOT EXISTS (
          SELECT 1 FROM goals_okr.user_key_result_instances ukri
          WHERE ukri.user_objective_instance_id = uoi.id AND ukri.key_result_id = kr.id
      );

    -- 3c. Kanban: 500 OBJECTIVE items
    INSERT INTO goals_okr.kanban_items (user_id, item_type, item_id, column_name, position, number)
    SELECT v_user_id, 'OBJECTIVE', uoi.id, 'TODO', (row_number() OVER () - 1),
           'KANBAN-' || nextval('goals_okr.seq_kanban_item_number')
    FROM goals_okr.user_objective_instances uoi
    JOIN goals_okr.objectives o ON o.id = uoi.objective_id
    WHERE uoi.user_id = v_user_id AND o.title_nl LIKE 'Perf test objective %'
      AND NOT EXISTS (
          SELECT 1 FROM goals_okr.kanban_items ki
          WHERE ki.user_id = v_user_id AND ki.item_type = 'OBJECTIVE' AND ki.item_id = uoi.id
      );

    -- 3d. Kanban: 500 KEY_RESULT items (position 500+ so they come after objectives)
    INSERT INTO goals_okr.kanban_items (user_id, item_type, item_id, column_name, position, number)
    SELECT v_user_id, 'KEY_RESULT', ukri.id, 'TODO', (500 + row_number() OVER () - 1),
           'KANBAN-' || nextval('goals_okr.seq_kanban_item_number')
    FROM goals_okr.user_key_result_instances ukri
    JOIN goals_okr.user_objective_instances uoi ON uoi.id = ukri.user_objective_instance_id
    JOIN goals_okr.objectives o ON o.id = uoi.objective_id
    WHERE uoi.user_id = v_user_id AND o.title_nl LIKE 'Perf test objective %'
      AND NOT EXISTS (
          SELECT 1 FROM goals_okr.kanban_items ki
          WHERE ki.user_id = v_user_id AND ki.item_type = 'KEY_RESULT' AND ki.item_id = ukri.id
      );
END $$;

RESET search_path;
