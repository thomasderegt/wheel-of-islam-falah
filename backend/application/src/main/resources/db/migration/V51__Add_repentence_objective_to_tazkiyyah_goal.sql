-- =====================================================
-- Flyway Migration V51: Add Repentence Objective to Tazkiyyah Goal
-- =====================================================
-- Adds a "Repentence" objective template to the "Tazkiyyah - Purification of the heart" goal
-- =====================================================

SET search_path TO goals_okr;

-- Find the Tazkiyyah goal and add the Repentence objective
WITH tazkiyyah_goal AS (
    SELECT id FROM goals_okr.goals 
    WHERE title_en = 'Tazkiyyah - Purification of the heart'
    LIMIT 1
),
existing_objectives_count AS (
    SELECT COUNT(*) as count 
    FROM goals_okr.objectives 
    WHERE goal_id = (SELECT id FROM tazkiyyah_goal)
)
INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
SELECT 
    (SELECT id FROM tazkiyyah_goal),
    'Berouw',
    'Repentence',
    'Berouw (tawbah) beoefenen en vergeving zoeken',
    'Practice repentance (tawbah) and seek forgiveness',
    (SELECT count + 1 FROM existing_objectives_count)
WHERE EXISTS (SELECT 1 FROM tazkiyyah_goal);

-- Generate number for the new objective (if entity numbering is enabled)
-- Note: The number will be generated automatically by the application when the objective is accessed

RESET search_path;
