-- =====================================================
-- Flyway Migration V68: Seed Bulk Objectives for Performance Test
-- =====================================================
-- Inserts 500 template objectives per life domain for load testing.
-- Total: ~5000 objectives (10 Wheel of Life domains × 500).
-- Idempotent: skips if perf test objectives already exist.
-- =====================================================

SET search_path TO goals_okr;

-- Skip if already seeded (idempotent)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM goals_okr.objectives WHERE title_nl LIKE 'Perf test objective %' LIMIT 1) THEN
        RAISE NOTICE 'Bulk perf test objectives already exist, skipping V68';
        RETURN;
    END IF;

    -- Insert 500 objectives per life domain (Wheel of Life)
    -- order_index starts after existing max per domain to avoid uk_objective_life_domain_order conflict
    INSERT INTO goals_okr.objectives (life_domain_id, title_nl, title_en, order_index, created_by_user_id)
    SELECT
        ld.id,
        'Perf test objective ' || gs.i,
        'Perf test objective ' || gs.i,
        base.max_order + gs.i,
        NULL
    FROM goals_okr.life_domains ld
    CROSS JOIN LATERAL (
        SELECT COALESCE(MAX(o.order_index), 0) AS max_order
        FROM goals_okr.objectives o
        WHERE o.life_domain_id = ld.id
    ) base
    CROSS JOIN generate_series(1, 500) gs(i)
    WHERE ld.wheel_id = (SELECT id FROM goals_okr.wheels WHERE wheel_key = 'WHEEL_OF_LIFE');
END $$;

RESET search_path;
