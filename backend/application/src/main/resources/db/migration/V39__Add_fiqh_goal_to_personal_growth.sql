-- =====================================================
-- Flyway Migration V39: Add Fiqh Goal to Personal Growth
-- =====================================================
-- Adds a Fiqh goal template to Personal Growth life domain
-- =====================================================

-- Set search path to goals_okr schema
SET search_path TO goals_okr;

-- Goal: "Fiqh - Begrijpen en toepassen van goddelijke richtlijnen"
WITH personal_growth_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'PERSONAL_GROWTH'
),
goal_pg_6 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Fiqh - Begrijpen en toepassen van goddelijke richtlijnen',
        'Fiqh - Understanding and applying divine guidelines',
        'Fiqh leren en toepassen: hoe je bidt, hoe je eet, halal/haram, dagelijkse praktijken volgens islamitische richtlijnen.',
        'Learn and apply Fiqh: how to pray, how to eat, halal/haram, daily practices according to Islamic guidelines.',
        6
    FROM personal_growth_domain
    RETURNING id
),
obj_pg_6_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Gebed (Salaat) Fiqh leren',
        'Learn Prayer (Salaat) Fiqh',
        NULL,
        NULL,
        1
    FROM goal_pg_6 goal
    RETURNING id
),
obj_pg_6_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Halal/Haram richtlijnen leren per onderwerp',
        'Learn Halal/Haram guidelines per topic',
        NULL,
        NULL,
        2
    FROM goal_pg_6 goal
    RETURNING id
),
obj_pg_6_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Dagelijkse praktijken volgens Fiqh',
        'Daily practices according to Fiqh',
        NULL,
        NULL,
        3
    FROM goal_pg_6 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Gebed (Salaat) Fiqh leren"
SELECT obj.id, '1 hoofdstuk per week', '1 chapter per week', NULL, NULL, 1.00, 'hoofdstukken per week', 1 FROM obj_pg_6_1 obj
UNION ALL
SELECT obj.id, '4 hoofdstukken per maand', '4 chapters per month', NULL, NULL, 4.00, 'hoofdstukken per maand', 2 FROM obj_pg_6_1 obj
-- Key Results for Objective 2: "Halal/Haram richtlijnen leren per onderwerp"
UNION ALL
SELECT obj.id, '1 onderwerp per week', '1 topic per week', NULL, NULL, 1.00, 'onderwerpen per week', 1 FROM obj_pg_6_2 obj
UNION ALL
SELECT obj.id, '4 onderwerpen per maand', '4 topics per month', NULL, NULL, 4.00, 'onderwerpen per maand', 2 FROM obj_pg_6_2 obj
-- Key Results for Objective 3: "Dagelijkse praktijken volgens Fiqh"
UNION ALL
SELECT obj.id, 'Dagelijks toepassen', 'Daily application', NULL, NULL, 30.00, 'dagen', 1 FROM obj_pg_6_3 obj
UNION ALL
SELECT obj.id, '100% consistentie', '100% consistency', NULL, NULL, 100.00, 'percentage', 2 FROM obj_pg_6_3 obj;
