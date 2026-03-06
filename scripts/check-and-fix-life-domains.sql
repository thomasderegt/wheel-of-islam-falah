-- Check and fix life domains for Wheel of Success
-- Run: psql -U $USER -d woi_backend_v2 -f scripts/check-and-fix-life-domains.sql

SET search_path TO goals_okr;

\echo '=== Wheels ==='
SELECT id, wheel_key, name_en FROM goals_okr.wheels ORDER BY display_order;

\echo ''
\echo '=== Life domains with wheel_id (before fix) ==='
SELECT id, domain_key, wheel_id, 
  (SELECT wheel_key FROM goals_okr.wheels w WHERE w.id = ld.wheel_id) as wheel_key
FROM goals_okr.life_domains ld
WHERE domain_key IN ('FIQH', 'TAZKIYYAH', 'FALAH', 'RELIGION')
ORDER BY domain_key;

\echo ''
\echo '=== Fix: Insert or update FIQH, TAZKIYYAH, FALAH for WHEEL_OF_SUCCESS ==='
INSERT INTO goals_okr.life_domains (domain_key, title_nl, title_en, description_nl, description_en, icon_name, display_order, wheel_id)
SELECT 'FIQH', 'Fiqh', 'Fiqh', 'Vorming van handelen', 'Formation of action', 'scale', 0, w.id
FROM goals_okr.wheels w WHERE w.wheel_key = 'WHEEL_OF_SUCCESS'
ON CONFLICT (domain_key) DO UPDATE SET wheel_id = EXCLUDED.wheel_id;

INSERT INTO goals_okr.life_domains (domain_key, title_nl, title_en, description_nl, description_en, icon_name, display_order, wheel_id)
SELECT 'TAZKIYYAH', 'Tazkiyyah', 'Tazkiyyah', 'Vorming van hart', 'Formation of heart', 'heart', 1, w.id
FROM goals_okr.wheels w WHERE w.wheel_key = 'WHEEL_OF_SUCCESS'
ON CONFLICT (domain_key) DO UPDATE SET wheel_id = EXCLUDED.wheel_id;

INSERT INTO goals_okr.life_domains (domain_key, title_nl, title_en, description_nl, description_en, icon_name, display_order, wheel_id)
SELECT 'FALAH', 'Falah', 'Falah', 'Holistisch succes', 'Holistic success', 'star', 0, w.id
FROM goals_okr.wheels w WHERE w.wheel_key = 'WHEEL_OF_SUCCESS'
ON CONFLICT (domain_key) DO UPDATE SET wheel_id = EXCLUDED.wheel_id;

\echo ''
\echo '=== Life domains after fix ==='
SELECT id, domain_key, wheel_id, 
  (SELECT wheel_key FROM goals_okr.wheels w WHERE w.id = ld.wheel_id) as wheel_key
FROM goals_okr.life_domains ld
WHERE domain_key IN ('FIQH', 'TAZKIYYAH', 'FALAH')
ORDER BY domain_key;
