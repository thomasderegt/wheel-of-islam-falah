-- =====================================================
-- Flyway Migration V53: Update Goal 83 Title
-- =====================================================
-- Updates the title of goal with number "GOAL-83" from "test5" to "Succesvolle implementatie Vaste Bedragen"
-- =====================================================

SET search_path TO goals_okr;

-- Update goal title where title contains "test5" or number is "GOAL-83"
UPDATE goals_okr.goals
SET 
    title_nl = 'Succesvolle implementatie Vaste Bedragen',
    title_en = 'Successful implementation Fixed Amounts',
    updated_at = CURRENT_TIMESTAMP
WHERE 
    (title_nl ILIKE '%test5%' OR title_en ILIKE '%test5%')
    OR number = 'GOAL-83'
    OR id = 83;

RESET search_path;
