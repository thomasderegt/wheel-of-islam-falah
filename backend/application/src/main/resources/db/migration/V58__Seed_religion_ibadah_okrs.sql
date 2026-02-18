-- =====================================================
-- Flyway Migration V58: Seed Religion / ʿIbādah OKRs
-- =====================================================
-- Seeds 3 OKRs for the Religion / ʿIbādah life domain.
-- Removes existing Religion objectives first (CASCADE deletes key_results and user instances).
-- =====================================================

SET search_path TO goals_okr;

-- Remove existing Religion objectives (CASCADE handles key_results, user_objective_instances, etc.)
DELETE FROM goals_okr.objectives
WHERE life_domain_id = (SELECT id FROM goals_okr.life_domains WHERE domain_key = 'RELIGION');

-- =====================================================
-- OKR 1 — Prayer Consistency & Quality
-- =====================================================
WITH religion_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'RELIGION'
),
obj_1 AS (
    INSERT INTO goals_okr.objectives (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Mijn gebeden zijn consistent en meer gefocust',
        'My prayers are consistent and more focused',
        NULL,
        NULL,
        1
    FROM religion_domain
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
SELECT obj.id, 'Alle verplichte gebeden voltooid op ≥25 dagen', 'All obligatory prayers completed on ≥25 days', NULL, NULL, 25.00, 'dagen', 1 FROM obj_1 obj
UNION ALL
SELECT obj.id, 'Fajr op tijd op ≥22 dagen', 'Fajr on time on ≥22 days', NULL, NULL, 22.00, 'dagen', 2 FROM obj_1 obj
UNION ALL
SELECT obj.id, 'Khushu zelfbeoordeling gemiddeld ≥7/10 over de periode', 'Khushu self-rating averages ≥7/10 across the period', NULL, NULL, 7.00, 'uit 10', 3 FROM obj_1 obj;

-- =====================================================
-- OKR 2 — Qur'an & Understanding
-- =====================================================
WITH religion_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'RELIGION'
),
obj_2 AS (
    INSERT INTO goals_okr.objectives (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Mijn begrip van de Qur''an vormt hoe ik denk en handel',
        'My understanding of the Qur''an shapes how I think and act',
        NULL,
        NULL,
        2
    FROM religion_domain
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
SELECT obj.id, 'Gereflecteerd op en begrepen de betekenis van 20 passages of soera''s', 'Reflected on and understood the meaning of 20 passages or surahs', NULL, NULL, 20.00, 'passages', 1 FROM obj_2 obj
UNION ALL
SELECT obj.id, '5–10 verzen gememoriseerd en correct herinnerd aan periode-einde', 'Memorized 5–10 verses and correctly recalled them at period end', NULL, NULL, 7.00, 'verzen', 2 FROM obj_2 obj
UNION ALL
SELECT obj.id, '5 Qur''anische lessen toegepast op echte beslissingen of gedrag', 'Applied 5 Qur''anic lessons to real-life decisions or behavior', NULL, NULL, 5.00, 'lessen', 3 FROM obj_2 obj;

-- =====================================================
-- OKR 3 — Dhikr & Spiritual Impact
-- =====================================================
WITH religion_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'RELIGION'
),
obj_3 AS (
    INSERT INTO goals_okr.objectives (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Mijn herinnering aan Allah verhoogt mijn dagelijkse bewustzijn en gedrag',
        'My remembrance of Allah increases my daily awareness and behavior',
        NULL,
        NULL,
        3
    FROM religion_domain
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
SELECT obj.id, 'Spirituele mindfulness zelfscore verbetert met +2 punten', 'Spiritual mindfulness self-score improves by +2 points', NULL, NULL, 2.00, 'punten', 1 FROM obj_3 obj
UNION ALL
SELECT obj.id, '10 momenten gedocumenteerd waar dhikr of duʿāʾ een reactie of keuze veranderde', 'Documented 10 moments where dhikr or duʿāʾ changed a reaction or choice', NULL, NULL, 10.00, 'momenten', 2 FROM obj_3 obj
UNION ALL
SELECT obj.id, 'Eén terugkerende onoplettende gewoonte meetbaar verminderd', 'Reduced one recurring heedless habit measurably', NULL, NULL, 1.00, 'gewoontes', 3 FROM obj_3 obj;

RESET search_path;
