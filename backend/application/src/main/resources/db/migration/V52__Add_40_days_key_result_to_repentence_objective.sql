-- =====================================================
-- Flyway Migration V52: Add "40 days" Key Result to Repentence Objective
-- =====================================================
-- Adds a "40 days" key result template to the "Repentence" objective (objective_id: 641).
-- =====================================================

SET search_path TO goals_okr;

-- Find the 'Repentence' objective (objective_id: 641)
WITH repentance_objective AS (
    SELECT id FROM goals_okr.objectives WHERE id = 641
),
-- Determine the next order_index for key results under this objective
next_order_index AS (
    SELECT COALESCE(MAX(order_index), 0) + 1 AS next_index
    FROM goals_okr.key_results
    WHERE objective_id = (SELECT id FROM repentance_objective)
)
-- Insert the new '40 days' key result
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
SELECT
    ro.id,
    '40 dagen',
    '40 days',
    '40 dagen berouw (tawbah) beoefenen',
    'Practice repentance (tawbah) for 40 days',
    40.00,
    'dagen',
    noi.next_index
FROM repentance_objective ro, next_order_index noi;

RESET search_path;
