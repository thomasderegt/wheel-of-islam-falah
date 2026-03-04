-- =====================================================
-- Flyway Migration V82: Ensure all life domains have wheel_id
-- =====================================================
-- Fixes life domains with NULL wheel_id by assigning WHEEL_OF_LIFE
-- =====================================================

SET search_path TO goals_okr;

UPDATE goals_okr.life_domains ld
SET wheel_id = w.id
FROM goals_okr.wheels w
WHERE w.wheel_key = 'WHEEL_OF_LIFE'
  AND ld.wheel_id IS NULL;

RESET search_path;
