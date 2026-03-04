-- =====================================================
-- Flyway Migration V83: Fix Wheel of Success domain assignments
-- =====================================================
-- Ensures FIQH, TAZKIYYAH, FALAH are linked to WHEEL_OF_SUCCESS
-- =====================================================

SET search_path TO goals_okr;

UPDATE goals_okr.life_domains ld
SET wheel_id = w.id
FROM goals_okr.wheels w
WHERE w.wheel_key = 'WHEEL_OF_SUCCESS'
  AND ld.domain_key IN ('FIQH', 'TAZKIYYAH', 'FALAH');

RESET search_path;
