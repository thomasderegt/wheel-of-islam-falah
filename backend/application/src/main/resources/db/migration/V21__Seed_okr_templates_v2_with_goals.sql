-- =====================================================
-- Flyway Migration V21: Seed OKR Templates V2 with Goals
-- =====================================================
-- Seeds OKR templates (Goals, Objectives, Key Results) for all 10 life domains
-- Based on GOAL_TEMPLATES_OKR_V2.md
-- Structure: Life Domain → Goal → Objective → Key Result
-- Life Domains: RELIGION, PERSONAL_GROWTH, FAMILY, HEALTH, FINANCE,
--               WORK, EDUCATION, SOCIAL, SPORTS, REST
-- =====================================================

-- Set search path to goals_okr schema
SET search_path TO goals_okr;

-- =====================================================
-- Clear existing data (from V18 and V20 migration)
-- =====================================================
-- Delete in reverse order of dependencies
DELETE FROM key_result_progress;
DELETE FROM initiatives;
DELETE FROM user_objective_instances;
DELETE FROM key_results;
DELETE FROM objectives;
DELETE FROM goals;

-- =====================================================
-- 1. RELIGION (Religie / ʿIbādah)
-- =====================================================

-- Goal 1: "Dagelijks gebed consistent verrichten"
WITH religion_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'RELIGION'
),
goal_religion_1 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'Dagelijks gebed consistent verrichten',
        'Perform daily prayers consistently',
        'Alle vijf dagelijkse gebeden op tijd verrichten als basis voor spirituele groei.',
        'Perform all five daily prayers on time as a foundation for spiritual growth.',
        1
    FROM religion_domain
    RETURNING id
),
obj_religion_1_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Fajr op tijd verrichten',
        'Perform Fajr on time',
        NULL,
        NULL,
        1
    FROM goal_religion_1 goal
    RETURNING id
),
obj_religion_1_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Alle 5 gebeden verrichten',
        'Perform all 5 prayers',
        NULL,
        NULL,
        2
    FROM goal_religion_1 goal
    RETURNING id
),
obj_religion_1_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Gebed in gemeenschap verrichten',
        'Perform prayer in community',
        NULL,
        NULL,
        3
    FROM goal_religion_1 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Fajr op tijd verrichten"
SELECT obj.id, '30 dagen op tijd', '30 days on time', NULL, NULL, 30.00, 'dagen', 1 FROM obj_religion_1_1 obj
UNION ALL
SELECT obj.id, '100% op tijd', '100% on time', NULL, NULL, 100.00, 'percentage', 2 FROM obj_religion_1_1 obj
-- Key Results for Objective 2: "Alle 5 gebeden verrichten"
UNION ALL
SELECT obj.id, '7 dagen per week', '7 days per week', NULL, NULL, 7.00, 'dagen per week', 1 FROM obj_religion_1_2 obj
UNION ALL
SELECT obj.id, '100% consistentie', '100% consistency', NULL, NULL, 100.00, 'percentage', 2 FROM obj_religion_1_2 obj
-- Key Results for Objective 3: "Gebed in gemeenschap verrichten"
UNION ALL
SELECT obj.id, '4x per week naar moskee', '4x per week to mosque', NULL, NULL, 4.00, 'keren per week', 1 FROM obj_religion_1_3 obj
UNION ALL
SELECT obj.id, '80% van de tijd', '80% of the time', NULL, NULL, 80.00, 'percentage', 2 FROM obj_religion_1_3 obj;

-- Goal 2: "Qur'an dagelijks lezen en memoriseren"
WITH religion_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'RELIGION'
),
goal_religion_2 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Qur''an dagelijks lezen en memoriseren',
        'Read and memorize Qur''an daily',
        'Regelmatig Qur''an lezen en verzen memoriseren voor spirituele groei.',
        'Regularly read Qur''an and memorize verses for spiritual growth.',
        2
    FROM religion_domain
    RETURNING id
),
obj_religion_2_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Dagelijks Qur''an lezen',
        'Read Qur''an daily',
        NULL,
        NULL,
        1
    FROM goal_religion_2 goal
    RETURNING id
),
obj_religion_2_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Verzen memoriseren',
        'Memorize verses',
        NULL,
        NULL,
        2
    FROM goal_religion_2 goal
    RETURNING id
),
obj_religion_2_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Tafsir bestuderen',
        'Study Tafsir',
        NULL,
        NULL,
        3
    FROM goal_religion_2 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Dagelijks Qur'an lezen"
SELECT obj.id, '1 juz per maand', '1 juz per month', NULL, NULL, 1.00, 'juz per maand', 1 FROM obj_religion_2_1 obj
UNION ALL
SELECT obj.id, '30 dagen consistent', '30 days consistent', NULL, NULL, 30.00, 'dagen', 2 FROM obj_religion_2_1 obj
-- Key Results for Objective 2: "Verzen memoriseren"
UNION ALL
SELECT obj.id, '10 verzen per maand', '10 verses per month', NULL, NULL, 10.00, 'verzen per maand', 1 FROM obj_religion_2_2 obj
UNION ALL
SELECT obj.id, '100% retentie', '100% retention', NULL, NULL, 100.00, 'percentage', 2 FROM obj_religion_2_2 obj
-- Key Results for Objective 3: "Tafsir bestuderen"
UNION ALL
SELECT obj.id, '1 soera per maand', '1 soera per month', NULL, NULL, 1.00, 'soera per maand', 1 FROM obj_religion_2_3 obj
UNION ALL
SELECT obj.id, '4 weken consistent', '4 weeks consistent', NULL, NULL, 4.00, 'weken', 2 FROM obj_religion_2_3 obj;

-- Goal 3: "Dhikr en Dua praktijken versterken"
WITH religion_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'RELIGION'
),
goal_religion_3 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Dhikr en Dua praktijken versterken',
        'Strengthen Dhikr and Dua practices',
        'Dagelijkse dhikr en dua praktijken opbouwen voor spirituele connectie.',
        'Build daily dhikr and dua practices for spiritual connection.',
        3
    FROM religion_domain
    RETURNING id
),
obj_religion_3_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Ochtend dhikr routine',
        'Morning dhikr routine',
        NULL,
        NULL,
        1
    FROM goal_religion_3 goal
    RETURNING id
),
obj_religion_3_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Avond dhikr routine',
        'Evening dhikr routine',
        NULL,
        NULL,
        2
    FROM goal_religion_3 goal
    RETURNING id
),
obj_religion_3_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Dua maken',
        'Make Dua',
        NULL,
        NULL,
        3
    FROM goal_religion_3 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Ochtend dhikr routine"
SELECT obj.id, '30 dagen consistent', '30 days consistent', NULL, NULL, 30.00, 'dagen', 1 FROM obj_religion_3_1 obj
UNION ALL
SELECT obj.id, '100% consistentie', '100% consistency', NULL, NULL, 100.00, 'percentage', 2 FROM obj_religion_3_1 obj
-- Key Results for Objective 2: "Avond dhikr routine"
UNION ALL
SELECT obj.id, '30 dagen consistent', '30 days consistent', NULL, NULL, 30.00, 'dagen', 1 FROM obj_religion_3_2 obj
UNION ALL
SELECT obj.id, '100% consistentie', '100% consistency', NULL, NULL, 100.00, 'percentage', 2 FROM obj_religion_3_2 obj
-- Key Results for Objective 3: "Dua maken"
UNION ALL
SELECT obj.id, '3x per dag', '3x per day', NULL, NULL, 3.00, 'keren per dag', 1 FROM obj_religion_3_3 obj
UNION ALL
SELECT obj.id, '90 dagen consistent', '90 days consistent', NULL, NULL, 90.00, 'dagen', 2 FROM obj_religion_3_3 obj;

-- Goal 4: "Ramadan voorbereiding en praktijken"
WITH religion_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'RELIGION'
),
goal_religion_4 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Ramadan voorbereiding en praktijken',
        'Ramadan preparation and practices',
        'Voorbereiden op Ramadan en Ramadan praktijken consistent uitvoeren.',
        'Prepare for Ramadan and consistently perform Ramadan practices.',
        4
    FROM religion_domain
    RETURNING id
),
obj_religion_4_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Vasten verrichten',
        'Perform fasting',
        NULL,
        NULL,
        1
    FROM goal_religion_4 goal
    RETURNING id
),
obj_religion_4_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Taraweeh gebed',
        'Taraweeh prayer',
        NULL,
        NULL,
        2
    FROM goal_religion_4 goal
    RETURNING id
),
obj_religion_4_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'I''tikaf verrichten',
        'Perform I''tikaf',
        NULL,
        NULL,
        3
    FROM goal_religion_4 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Vasten verrichten"
SELECT obj.id, 'Alle dagen van Ramadan', 'All days of Ramadan', NULL, NULL, 30.00, 'dagen', 1 FROM obj_religion_4_1 obj
UNION ALL
SELECT obj.id, '100% van de dagen', '100% of the days', NULL, NULL, 100.00, 'percentage', 2 FROM obj_religion_4_1 obj
-- Key Results for Objective 2: "Taraweeh gebed"
UNION ALL
SELECT obj.id, '20 dagen naar moskee', '20 days to mosque', NULL, NULL, 20.00, 'dagen', 1 FROM obj_religion_4_2 obj
UNION ALL
SELECT obj.id, '67% van Ramadan', '67% of Ramadan', NULL, NULL, 67.00, 'percentage', 2 FROM obj_religion_4_2 obj
-- Key Results for Objective 3: "I'tikaf verrichten"
UNION ALL
SELECT obj.id, 'Laatste 10 dagen', 'Last 10 days', NULL, NULL, 10.00, 'dagen', 1 FROM obj_religion_4_3 obj
UNION ALL
SELECT obj.id, '100% van laatste 10 dagen', '100% of last 10 days', NULL, NULL, 100.00, 'percentage', 2 FROM obj_religion_4_3 obj;

-- Goal 5: "Islamitische kennis vergroten"
WITH religion_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'RELIGION'
),
goal_religion_5 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Islamitische kennis vergroten',
        'Increase Islamic knowledge',
        'Regelmatig islamitische kennis opdoen voor spirituele groei.',
        'Regularly acquire Islamic knowledge for spiritual growth.',
        5
    FROM religion_domain
    RETURNING id
),
obj_religion_5_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Islamitische lessen volgen',
        'Follow Islamic lessons',
        NULL,
        NULL,
        1
    FROM goal_religion_5 goal
    RETURNING id
),
obj_religion_5_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Islamitische boeken lezen',
        'Read Islamic books',
        NULL,
        NULL,
        2
    FROM goal_religion_5 goal
    RETURNING id
),
obj_religion_5_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Seerah bestuderen',
        'Study Seerah',
        NULL,
        NULL,
        3
    FROM goal_religion_5 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Islamitische lessen volgen"
SELECT obj.id, '1 les per week', '1 lesson per week', NULL, NULL, 1.00, 'lessen per week', 1 FROM obj_religion_5_1 obj
UNION ALL
SELECT obj.id, '4 lessen per maand', '4 lessons per month', NULL, NULL, 4.00, 'lessen per maand', 2 FROM obj_religion_5_1 obj
-- Key Results for Objective 2: "Islamitische boeken lezen"
UNION ALL
SELECT obj.id, '1 boek per maand', '1 book per month', NULL, NULL, 1.00, 'boeken per maand', 1 FROM obj_religion_5_2 obj
UNION ALL
SELECT obj.id, '12 boeken per jaar', '12 books per year', NULL, NULL, 12.00, 'boeken per jaar', 2 FROM obj_religion_5_2 obj
-- Key Results for Objective 3: "Seerah bestuderen"
UNION ALL
SELECT obj.id, '1 hoofdstuk per week', '1 chapter per week', NULL, NULL, 1.00, 'hoofdstukken per week', 1 FROM obj_religion_5_3 obj
UNION ALL
SELECT obj.id, '4 hoofdstukken per maand', '4 chapters per month', NULL, NULL, 4.00, 'hoofdstukken per maand', 2 FROM obj_religion_5_3 obj;

-- =====================================================
-- 2. PERSONAL_GROWTH (Persoonlijke Groei / Tazkiyyah)
-- =====================================================

-- Goal 1: "Tazkiyyah - Zuivering van het hart"
WITH personal_growth_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'PERSONAL_GROWTH'
),
goal_pg_1 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Tazkiyyah - Zuivering van het hart',
        'Tazkiyyah - Purification of the heart',
        'Werken aan zuivering en ontwikkeling van het hart voor spirituele groei.',
        'Work on purification and development of the heart for spiritual growth.',
        1
    FROM personal_growth_domain
    RETURNING id
),
obj_pg_1_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Zelfreflectie praktijken',
        'Self-reflection practices',
        NULL,
        NULL,
        1
    FROM goal_pg_1 goal
    RETURNING id
),
obj_pg_1_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Negatieve eigenschappen verminderen',
        'Reduce negative traits',
        NULL,
        NULL,
        2
    FROM goal_pg_1 goal
    RETURNING id
),
obj_pg_1_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Positieve eigenschappen ontwikkelen',
        'Develop positive traits',
        NULL,
        NULL,
        3
    FROM goal_pg_1 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Zelfreflectie praktijken"
SELECT obj.id, 'Dagelijks 15 minuten', 'Daily 15 minutes', NULL, NULL, 15.00, 'minuten per dag', 1 FROM obj_pg_1_1 obj
UNION ALL
SELECT obj.id, '30 dagen consistent', '30 days consistent', NULL, NULL, 30.00, 'dagen', 2 FROM obj_pg_1_1 obj
-- Key Results for Objective 2: "Negatieve eigenschappen verminderen"
UNION ALL
SELECT obj.id, '1 eigenschap per maand', '1 trait per month', NULL, NULL, 1.00, 'eigenschappen per maand', 1 FROM obj_pg_1_2 obj
UNION ALL
SELECT obj.id, '12 eigenschappen per jaar', '12 traits per year', NULL, NULL, 12.00, 'eigenschappen per jaar', 2 FROM obj_pg_1_2 obj
-- Key Results for Objective 3: "Positieve eigenschappen ontwikkelen"
UNION ALL
SELECT obj.id, '1 eigenschap per maand', '1 trait per month', NULL, NULL, 1.00, 'eigenschappen per maand', 1 FROM obj_pg_1_3 obj
UNION ALL
SELECT obj.id, '12 eigenschappen per jaar', '12 traits per year', NULL, NULL, 12.00, 'eigenschappen per jaar', 2 FROM obj_pg_1_3 obj;

-- Goal 2: "Karakterontwikkeling"
WITH personal_growth_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'PERSONAL_GROWTH'
),
goal_pg_2 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Karakterontwikkeling',
        'Character development',
        'Goede karaktereigenschappen ontwikkelen volgens islamitische waarden.',
        'Develop good character traits according to Islamic values.',
        2
    FROM personal_growth_domain
    RETURNING id
),
obj_pg_2_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Geduld ontwikkelen',
        'Develop patience',
        NULL,
        NULL,
        1
    FROM goal_pg_2 goal
    RETURNING id
),
obj_pg_2_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Nederigheid versterken',
        'Strengthen humility',
        NULL,
        NULL,
        2
    FROM goal_pg_2 goal
    RETURNING id
),
obj_pg_2_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Vriendelijkheid tonen',
        'Show kindness',
        NULL,
        NULL,
        3
    FROM goal_pg_2 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Geduld ontwikkelen"
SELECT obj.id, '30 dagen oefenen', '30 days practice', NULL, NULL, 30.00, 'dagen', 1 FROM obj_pg_2_1 obj
UNION ALL
SELECT obj.id, '100% bewustzijn', '100% awareness', NULL, NULL, 100.00, 'percentage', 2 FROM obj_pg_2_1 obj
-- Key Results for Objective 2: "Nederigheid versterken"
UNION ALL
SELECT obj.id, 'Dagelijks oefenen', 'Daily practice', NULL, NULL, 30.00, 'dagen', 1 FROM obj_pg_2_2 obj
UNION ALL
SELECT obj.id, '100% consistentie', '100% consistency', NULL, NULL, 100.00, 'percentage', 2 FROM obj_pg_2_2 obj
-- Key Results for Objective 3: "Vriendelijkheid tonen"
UNION ALL
SELECT obj.id, '3 daden per dag', '3 acts per day', NULL, NULL, 3.00, 'daden per dag', 1 FROM obj_pg_2_3 obj
UNION ALL
SELECT obj.id, '90 daden per maand', '90 acts per month', NULL, NULL, 90.00, 'daden per maand', 2 FROM obj_pg_2_3 obj;

-- Goal 3: "Zelfreflectie en evaluatie"
WITH personal_growth_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'PERSONAL_GROWTH'
),
goal_pg_3 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Zelfreflectie en evaluatie',
        'Self-reflection and evaluation',
        'Regelmatige zelfreflectie en evaluatie voor continue groei.',
        'Regular self-reflection and evaluation for continuous growth.',
        3
    FROM personal_growth_domain
    RETURNING id
),
obj_pg_3_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Dagelijkse reflectie',
        'Daily reflection',
        NULL,
        NULL,
        1
    FROM goal_pg_3 goal
    RETURNING id
),
obj_pg_3_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Weekelijkse evaluatie',
        'Weekly evaluation',
        NULL,
        NULL,
        2
    FROM goal_pg_3 goal
    RETURNING id
),
obj_pg_3_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Maandelijkse review',
        'Monthly review',
        NULL,
        NULL,
        3
    FROM goal_pg_3 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Dagelijkse reflectie"
SELECT obj.id, '30 dagen consistent', '30 days consistent', NULL, NULL, 30.00, 'dagen', 1 FROM obj_pg_3_1 obj
UNION ALL
SELECT obj.id, '100% consistentie', '100% consistency', NULL, NULL, 100.00, 'percentage', 2 FROM obj_pg_3_1 obj
-- Key Results for Objective 2: "Weekelijkse evaluatie"
UNION ALL
SELECT obj.id, 'Elke week', 'Every week', NULL, NULL, 4.00, 'weken per maand', 1 FROM obj_pg_3_2 obj
UNION ALL
SELECT obj.id, '100% van de weken', '100% of the weeks', NULL, NULL, 100.00, 'percentage', 2 FROM obj_pg_3_2 obj
-- Key Results for Objective 3: "Maandelijkse review"
UNION ALL
SELECT obj.id, 'Elke maand', 'Every month', NULL, NULL, 12.00, 'maanden per jaar', 1 FROM obj_pg_3_3 obj
UNION ALL
SELECT obj.id, '100% van de maanden', '100% of the months', NULL, NULL, 100.00, 'percentage', 2 FROM obj_pg_3_3 obj;

-- Goal 4: "Emotionele intelligentie ontwikkelen"
WITH personal_growth_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'PERSONAL_GROWTH'
),
goal_pg_4 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Emotionele intelligentie ontwikkelen',
        'Develop emotional intelligence',
        'Emotionele intelligentie ontwikkelen voor betere relaties en groei.',
        'Develop emotional intelligence for better relationships and growth.',
        4
    FROM personal_growth_domain
    RETURNING id
),
obj_pg_4_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Emoties herkennen',
        'Recognize emotions',
        NULL,
        NULL,
        1
    FROM goal_pg_4 goal
    RETURNING id
),
obj_pg_4_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Emoties reguleren',
        'Regulate emotions',
        NULL,
        NULL,
        2
    FROM goal_pg_4 goal
    RETURNING id
),
obj_pg_4_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Empathie ontwikkelen',
        'Develop empathy',
        NULL,
        NULL,
        3
    FROM goal_pg_4 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Emoties herkennen"
SELECT obj.id, 'Dagelijks oefenen', 'Daily practice', NULL, NULL, 30.00, 'dagen', 1 FROM obj_pg_4_1 obj
UNION ALL
SELECT obj.id, '100% bewustzijn', '100% awareness', NULL, NULL, 100.00, 'percentage', 2 FROM obj_pg_4_1 obj
-- Key Results for Objective 2: "Emoties reguleren"
UNION ALL
SELECT obj.id, '30 dagen oefenen', '30 days practice', NULL, NULL, 30.00, 'dagen', 1 FROM obj_pg_4_2 obj
UNION ALL
SELECT obj.id, '100% succes rate', '100% success rate', NULL, NULL, 100.00, 'percentage', 2 FROM obj_pg_4_2 obj
-- Key Results for Objective 3: "Empathie ontwikkelen"
UNION ALL
SELECT obj.id, 'Dagelijks oefenen', 'Daily practice', NULL, NULL, 30.00, 'dagen', 1 FROM obj_pg_4_3 obj
UNION ALL
SELECT obj.id, '100% bewustzijn', '100% awareness', NULL, NULL, 100.00, 'percentage', 2 FROM obj_pg_4_3 obj;

-- Goal 5: "Persoonlijke visie en doelen"
WITH personal_growth_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'PERSONAL_GROWTH'
),
goal_pg_5 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Persoonlijke visie en doelen',
        'Personal vision and goals',
        'Duidelijke persoonlijke visie en doelen stellen voor Falah.',
        'Set clear personal vision and goals for Falah.',
        5
    FROM personal_growth_domain
    RETURNING id
),
obj_pg_5_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Persoonlijke visie formuleren',
        'Formulate personal vision',
        NULL,
        NULL,
        1
    FROM goal_pg_5 goal
    RETURNING id
),
obj_pg_5_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Korte termijn doelen',
        'Short-term goals',
        NULL,
        NULL,
        2
    FROM goal_pg_5 goal
    RETURNING id
),
obj_pg_5_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Lange termijn doelen',
        'Long-term goals',
        NULL,
        NULL,
        3
    FROM goal_pg_5 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Persoonlijke visie formuleren"
SELECT obj.id, '1 visie document', '1 vision document', NULL, NULL, 1.00, 'document', 1 FROM obj_pg_5_1 obj
UNION ALL
SELECT obj.id, '100% compleet', '100% complete', NULL, NULL, 100.00, 'percentage', 2 FROM obj_pg_5_1 obj
-- Key Results for Objective 2: "Korte termijn doelen"
UNION ALL
SELECT obj.id, '5 doelen per kwartaal', '5 goals per quarter', NULL, NULL, 5.00, 'doelen per kwartaal', 1 FROM obj_pg_5_2 obj
UNION ALL
SELECT obj.id, '20 doelen per jaar', '20 goals per year', NULL, NULL, 20.00, 'doelen per jaar', 2 FROM obj_pg_5_2 obj
-- Key Results for Objective 3: "Lange termijn doelen"
UNION ALL
SELECT obj.id, '3 doelen per jaar', '3 goals per year', NULL, NULL, 3.00, 'doelen per jaar', 1 FROM obj_pg_5_3 obj
UNION ALL
SELECT obj.id, '100% compleet', '100% complete', NULL, NULL, 100.00, 'percentage', 2 FROM obj_pg_5_3 obj;

-- =====================================================
-- 3. FAMILY (Gezin / Familie)
-- =====================================================

-- Goal 1: "Quality time met gezin"
WITH family_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'FAMILY'
),
goal_family_1 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Quality time met gezin',
        'Quality time with family',
        'Regelmatig quality time doorbrengen met gezin voor sterke familiebanden.',
        'Regularly spend quality time with family for strong family bonds.',
        1
    FROM family_domain
    RETURNING id
),
obj_family_1_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Weekend activiteiten',
        'Weekend activities',
        NULL,
        NULL,
        1
    FROM goal_family_1 goal
    RETURNING id
),
obj_family_1_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Dagelijks gesprek',
        'Daily conversation',
        NULL,
        NULL,
        2
    FROM goal_family_1 goal
    RETURNING id
),
obj_family_1_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Gezamenlijke maaltijden',
        'Shared meals',
        NULL,
        NULL,
        3
    FROM goal_family_1 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Weekend activiteiten"
SELECT obj.id, '2 activiteiten per maand', '2 activities per month', NULL, NULL, 2.00, 'activiteiten per maand', 1 FROM obj_family_1_1 obj
UNION ALL
SELECT obj.id, '24 activiteiten per jaar', '24 activities per year', NULL, NULL, 24.00, 'activiteiten per jaar', 2 FROM obj_family_1_1 obj
-- Key Results for Objective 2: "Dagelijks gesprek"
UNION ALL
SELECT obj.id, '30 minuten per dag', '30 minutes per day', NULL, NULL, 30.00, 'minuten per dag', 1 FROM obj_family_1_2 obj
UNION ALL
SELECT obj.id, '30 dagen consistent', '30 days consistent', NULL, NULL, 30.00, 'dagen', 2 FROM obj_family_1_2 obj
-- Key Results for Objective 3: "Gezamenlijke maaltijden"
UNION ALL
SELECT obj.id, '5x per week', '5x per week', NULL, NULL, 5.00, 'keren per week', 1 FROM obj_family_1_3 obj
UNION ALL
SELECT obj.id, '71% van de week', '71% of the week', NULL, NULL, 71.00, 'percentage', 2 FROM obj_family_1_3 obj;

-- Goal 2: "Familie verantwoordelijkheden"
WITH family_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'FAMILY'
),
goal_family_2 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Familie verantwoordelijkheden',
        'Family responsibilities',
        'Familie verantwoordelijkheden en taken consistent uitvoeren.',
        'Consistently perform family responsibilities and tasks.',
        2
    FROM family_domain
    RETURNING id
),
obj_family_2_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Dagelijkse taken',
        'Daily tasks',
        NULL,
        NULL,
        1
    FROM goal_family_2 goal
    RETURNING id
),
obj_family_2_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Weekelijkse taken',
        'Weekly tasks',
        NULL,
        NULL,
        2
    FROM goal_family_2 goal
    RETURNING id
),
obj_family_2_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Maandelijkse taken',
        'Monthly tasks',
        NULL,
        NULL,
        3
    FROM goal_family_2 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Dagelijkse taken"
SELECT obj.id, 'Alle taken voltooien', 'Complete all tasks', NULL, NULL, 100.00, 'percentage', 1 FROM obj_family_2_1 obj
UNION ALL
SELECT obj.id, '30 dagen consistent', '30 days consistent', NULL, NULL, 30.00, 'dagen', 2 FROM obj_family_2_1 obj
-- Key Results for Objective 2: "Weekelijkse taken"
UNION ALL
SELECT obj.id, 'Alle taken voltooien', 'Complete all tasks', NULL, NULL, 100.00, 'percentage', 1 FROM obj_family_2_2 obj
UNION ALL
SELECT obj.id, '4 weken per maand', '4 weeks per month', NULL, NULL, 4.00, 'weken per maand', 2 FROM obj_family_2_2 obj
-- Key Results for Objective 3: "Maandelijkse taken"
UNION ALL
SELECT obj.id, 'Alle taken voltooien', 'Complete all tasks', NULL, NULL, 100.00, 'percentage', 1 FROM obj_family_2_3 obj
UNION ALL
SELECT obj.id, '12 maanden per jaar', '12 months per year', NULL, NULL, 12.00, 'maanden per jaar', 2 FROM obj_family_2_3 obj;

-- Goal 3: "Open communicatie met gezin"
WITH family_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'FAMILY'
),
goal_family_3 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Open communicatie met gezin',
        'Open communication with family',
        'Open en respectvolle communicatie met gezin voor sterke relaties.',
        'Open and respectful communication with family for strong relationships.',
        3
    FROM family_domain
    RETURNING id
),
obj_family_3_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Dagelijks gesprek',
        'Daily conversation',
        NULL,
        NULL,
        1
    FROM goal_family_3 goal
    RETURNING id
),
obj_family_3_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Diepe gesprekken',
        'Deep conversations',
        NULL,
        NULL,
        2
    FROM goal_family_3 goal
    RETURNING id
),
obj_family_3_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Familie vergaderingen',
        'Family meetings',
        NULL,
        NULL,
        3
    FROM goal_family_3 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Dagelijks gesprek"
SELECT obj.id, '30 minuten per dag', '30 minutes per day', NULL, NULL, 30.00, 'minuten per dag', 1 FROM obj_family_3_1 obj
UNION ALL
SELECT obj.id, '30 dagen consistent', '30 days consistent', NULL, NULL, 30.00, 'dagen', 2 FROM obj_family_3_1 obj
-- Key Results for Objective 2: "Diepe gesprekken"
UNION ALL
SELECT obj.id, '1x per week', '1x per week', NULL, NULL, 1.00, 'keren per week', 1 FROM obj_family_3_2 obj
UNION ALL
SELECT obj.id, '4x per maand', '4x per month', NULL, NULL, 4.00, 'keren per maand', 2 FROM obj_family_3_2 obj
-- Key Results for Objective 3: "Familie vergaderingen"
UNION ALL
SELECT obj.id, '1x per maand', '1x per month', NULL, NULL, 1.00, 'keren per maand', 1 FROM obj_family_3_3 obj
UNION ALL
SELECT obj.id, '12x per jaar', '12x per year', NULL, NULL, 12.00, 'keren per jaar', 2 FROM obj_family_3_3 obj;

-- Goal 4: "Onderwijs en opvoeding"
WITH family_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'FAMILY'
),
goal_family_4 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Onderwijs en opvoeding',
        'Education and upbringing',
        'Onderwijs en opvoeding van kinderen volgens islamitische waarden.',
        'Education and upbringing of children according to Islamic values.',
        4
    FROM family_domain
    RETURNING id
),
obj_family_4_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Islamitische opvoeding',
        'Islamic upbringing',
        NULL,
        NULL,
        1
    FROM goal_family_4 goal
    RETURNING id
),
obj_family_4_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Academische ondersteuning',
        'Academic support',
        NULL,
        NULL,
        2
    FROM goal_family_4 goal
    RETURNING id
),
obj_family_4_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Karakterontwikkeling',
        'Character development',
        NULL,
        NULL,
        3
    FROM goal_family_4 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Islamitische opvoeding"
SELECT obj.id, 'Dagelijks lesgeven', 'Daily teaching', NULL, NULL, 30.00, 'dagen per maand', 1 FROM obj_family_4_1 obj
UNION ALL
SELECT obj.id, '100% consistentie', '100% consistency', NULL, NULL, 100.00, 'percentage', 2 FROM obj_family_4_1 obj
-- Key Results for Objective 2: "Academische ondersteuning"
UNION ALL
SELECT obj.id, '3x per week', '3x per week', NULL, NULL, 3.00, 'keren per week', 1 FROM obj_family_4_2 obj
UNION ALL
SELECT obj.id, '12x per maand', '12x per month', NULL, NULL, 12.00, 'keren per maand', 2 FROM obj_family_4_2 obj
-- Key Results for Objective 3: "Karakterontwikkeling"
UNION ALL
SELECT obj.id, 'Dagelijks oefenen', 'Daily practice', NULL, NULL, 30.00, 'dagen per maand', 1 FROM obj_family_4_3 obj
UNION ALL
SELECT obj.id, '100% consistentie', '100% consistency', NULL, NULL, 100.00, 'percentage', 2 FROM obj_family_4_3 obj;

-- Goal 5: "Familie tradities onderhouden"
WITH family_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'FAMILY'
),
goal_family_5 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Familie tradities onderhouden',
        'Maintain family traditions',
        'Familie tradities en rituelen onderhouden voor familiebanden.',
        'Maintain family traditions and rituals for family bonds.',
        5
    FROM family_domain
    RETURNING id
),
obj_family_5_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Weekelijkse tradities',
        'Weekly traditions',
        NULL,
        NULL,
        1
    FROM goal_family_5 goal
    RETURNING id
),
obj_family_5_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Maandelijkse tradities',
        'Monthly traditions',
        NULL,
        NULL,
        2
    FROM goal_family_5 goal
    RETURNING id
),
obj_family_5_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Jaarlijkse tradities',
        'Annual traditions',
        NULL,
        NULL,
        3
    FROM goal_family_5 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Weekelijkse tradities"
SELECT obj.id, 'Elke week', 'Every week', NULL, NULL, 4.00, 'weken per maand', 1 FROM obj_family_5_1 obj
UNION ALL
SELECT obj.id, '100% van de weken', '100% of the weeks', NULL, NULL, 100.00, 'percentage', 2 FROM obj_family_5_1 obj
-- Key Results for Objective 2: "Maandelijkse tradities"
UNION ALL
SELECT obj.id, 'Elke maand', 'Every month', NULL, NULL, 12.00, 'maanden per jaar', 1 FROM obj_family_5_2 obj
UNION ALL
SELECT obj.id, '100% van de maanden', '100% of the months', NULL, NULL, 100.00, 'percentage', 2 FROM obj_family_5_2 obj
-- Key Results for Objective 3: "Jaarlijkse tradities"
UNION ALL
SELECT obj.id, 'Elk jaar', 'Every year', NULL, NULL, 1.00, 'keren per jaar', 1 FROM obj_family_5_3 obj
UNION ALL
SELECT obj.id, '100% van de jaren', '100% of the years', NULL, NULL, 100.00, 'percentage', 2 FROM obj_family_5_3 obj;

-- =====================================================
-- 4. HEALTH (Gezondheid)
-- =====================================================

-- Goal 1: "Fysieke gezondheid verbeteren"
WITH health_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'HEALTH'
),
goal_health_1 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Fysieke gezondheid verbeteren',
        'Improve physical health',
        'Fysieke fitheid en welzijn verbeteren voor een gezond leven.',
        'Improve physical fitness and well-being for a healthy life.',
        1
    FROM health_domain
    RETURNING id
),
obj_health_1_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Dagelijkse beweging',
        'Daily movement',
        NULL,
        NULL,
        1
    FROM goal_health_1 goal
    RETURNING id
),
obj_health_1_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Weekelijkse training',
        'Weekly training',
        NULL,
        NULL,
        2
    FROM goal_health_1 goal
    RETURNING id
),
obj_health_1_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Maandelijkse evaluatie',
        'Monthly evaluation',
        NULL,
        NULL,
        3
    FROM goal_health_1 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Dagelijkse beweging"
SELECT obj.id, '30 minuten per dag', '30 minutes per day', NULL, NULL, 30.00, 'minuten per dag', 1 FROM obj_health_1_1 obj
UNION ALL
SELECT obj.id, '30 dagen per maand', '30 days per month', NULL, NULL, 30.00, 'dagen per maand', 2 FROM obj_health_1_1 obj
-- Key Results for Objective 2: "Weekelijkse training"
UNION ALL
SELECT obj.id, '3x per week', '3x per week', NULL, NULL, 3.00, 'keren per week', 1 FROM obj_health_1_2 obj
UNION ALL
SELECT obj.id, '12x per maand', '12x per month', NULL, NULL, 12.00, 'keren per maand', 2 FROM obj_health_1_2 obj
-- Key Results for Objective 3: "Maandelijkse evaluatie"
UNION ALL
SELECT obj.id, 'Elke maand', 'Every month', NULL, NULL, 12.00, 'maanden per jaar', 1 FROM obj_health_1_3 obj
UNION ALL
SELECT obj.id, '100% van de maanden', '100% of the months', NULL, NULL, 100.00, 'percentage', 2 FROM obj_health_1_3 obj;

-- Goal 2: "Mentale gezondheid verbeteren"
WITH health_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'HEALTH'
),
goal_health_2 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Mentale gezondheid verbeteren',
        'Improve mental health',
        'Mentale welzijn en balans verbeteren voor een gezond leven.',
        'Improve mental well-being and balance for a healthy life.',
        2
    FROM health_domain
    RETURNING id
),
obj_health_2_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Stress management',
        'Stress management',
        NULL,
        NULL,
        1
    FROM goal_health_2 goal
    RETURNING id
),
obj_health_2_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Mindfulness praktijken',
        'Mindfulness practices',
        NULL,
        NULL,
        2
    FROM goal_health_2 goal
    RETURNING id
),
obj_health_2_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Emotionele balans',
        'Emotional balance',
        NULL,
        NULL,
        3
    FROM goal_health_2 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Stress management"
SELECT obj.id, 'Dagelijks oefenen', 'Daily practice', NULL, NULL, 30.00, 'dagen per maand', 1 FROM obj_health_2_1 obj
UNION ALL
SELECT obj.id, '100% consistentie', '100% consistency', NULL, NULL, 100.00, 'percentage', 2 FROM obj_health_2_1 obj
-- Key Results for Objective 2: "Mindfulness praktijken"
UNION ALL
SELECT obj.id, '15 minuten per dag', '15 minutes per day', NULL, NULL, 15.00, 'minuten per dag', 1 FROM obj_health_2_2 obj
UNION ALL
SELECT obj.id, '30 dagen consistent', '30 days consistent', NULL, NULL, 30.00, 'dagen', 2 FROM obj_health_2_2 obj
-- Key Results for Objective 3: "Emotionele balans"
UNION ALL
SELECT obj.id, 'Dagelijks oefenen', 'Daily practice', NULL, NULL, 30.00, 'dagen per maand', 1 FROM obj_health_2_3 obj
UNION ALL
SELECT obj.id, '100% consistentie', '100% consistency', NULL, NULL, 100.00, 'percentage', 2 FROM obj_health_2_3 obj;

-- Goal 3: "Gezonde voeding"
WITH health_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'HEALTH'
),
goal_health_3 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Gezonde voeding',
        'Healthy nutrition',
        'Gezonde eetgewoonten ontwikkelen voor een gezond leven.',
        'Develop healthy eating habits for a healthy life.',
        3
    FROM health_domain
    RETURNING id
),
obj_health_3_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Dagelijks gezond eten',
        'Daily healthy eating',
        NULL,
        NULL,
        1
    FROM goal_health_3 goal
    RETURNING id
),
obj_health_3_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Halal & Tayyib voeding',
        'Halal & Tayyib nutrition',
        NULL,
        NULL,
        2
    FROM goal_health_3 goal
    RETURNING id
),
obj_health_3_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Meal planning',
        'Meal planning',
        NULL,
        NULL,
        3
    FROM goal_health_3 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Dagelijks gezond eten"
SELECT obj.id, '3 maaltijden per dag', '3 meals per day', NULL, NULL, 3.00, 'maaltijden per dag', 1 FROM obj_health_3_1 obj
UNION ALL
SELECT obj.id, '90 maaltijden per maand', '90 meals per month', NULL, NULL, 90.00, 'maaltijden per maand', 2 FROM obj_health_3_1 obj
-- Key Results for Objective 2: "Halal & Tayyib voeding"
UNION ALL
SELECT obj.id, '100% halal & tayyib', '100% halal & tayyib', NULL, NULL, 100.00, 'percentage', 1 FROM obj_health_3_2 obj
UNION ALL
SELECT obj.id, '30 dagen consistent', '30 days consistent', NULL, NULL, 30.00, 'dagen', 2 FROM obj_health_3_2 obj
-- Key Results for Objective 3: "Meal planning"
UNION ALL
SELECT obj.id, 'Weekelijks plannen', 'Weekly planning', NULL, NULL, 4.00, 'weken per maand', 1 FROM obj_health_3_3 obj
UNION ALL
SELECT obj.id, '100% van de weken', '100% of the weeks', NULL, NULL, 100.00, 'percentage', 2 FROM obj_health_3_3 obj;

-- Goal 4: "Gezonde slaapgewoonten"
WITH health_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'HEALTH'
),
goal_health_4 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Gezonde slaapgewoonten',
        'Healthy sleep habits',
        'Gezonde slaapgewoonten ontwikkelen voor optimaal welzijn.',
        'Develop healthy sleep habits for optimal well-being.',
        4
    FROM health_domain
    RETURNING id
),
obj_health_4_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Slaap routine',
        'Sleep routine',
        NULL,
        NULL,
        1
    FROM goal_health_4 goal
    RETURNING id
),
obj_health_4_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Slaap kwaliteit',
        'Sleep quality',
        NULL,
        NULL,
        2
    FROM goal_health_4 goal
    RETURNING id
),
obj_health_4_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Slaap duur',
        'Sleep duration',
        NULL,
        NULL,
        3
    FROM goal_health_4 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Slaap routine"
SELECT obj.id, '30 dagen consistent', '30 days consistent', NULL, NULL, 30.00, 'dagen', 1 FROM obj_health_4_1 obj
UNION ALL
SELECT obj.id, '100% consistentie', '100% consistency', NULL, NULL, 100.00, 'percentage', 2 FROM obj_health_4_1 obj
-- Key Results for Objective 2: "Slaap kwaliteit"
UNION ALL
SELECT obj.id, '7-8 uur per nacht', '7-8 hours per night', NULL, NULL, 7.50, 'uren per nacht', 1 FROM obj_health_4_2 obj
UNION ALL
SELECT obj.id, '30 nachten per maand', '30 nights per month', NULL, NULL, 30.00, 'nachten per maand', 2 FROM obj_health_4_2 obj
-- Key Results for Objective 3: "Slaap duur"
UNION ALL
SELECT obj.id, '7-8 uur per nacht', '7-8 hours per night', NULL, NULL, 7.50, 'uren per nacht', 1 FROM obj_health_4_3 obj
UNION ALL
SELECT obj.id, '30 nachten per maand', '30 nights per month', NULL, NULL, 30.00, 'nachten per maand', 2 FROM obj_health_4_3 obj;

-- Goal 5: "Preventieve gezondheidszorg"
WITH health_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'HEALTH'
),
goal_health_5 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Preventieve gezondheidszorg',
        'Preventive healthcare',
        'Regelmatige gezondheidscontroles voor preventieve zorg.',
        'Regular health checkups for preventive care.',
        5
    FROM health_domain
    RETURNING id
),
obj_health_5_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Regelmatige controles',
        'Regular checkups',
        NULL,
        NULL,
        1
    FROM goal_health_5 goal
    RETURNING id
),
obj_health_5_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Vaccinaties',
        'Vaccinations',
        NULL,
        NULL,
        2
    FROM goal_health_5 goal
    RETURNING id
),
obj_health_5_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Screenings',
        'Screenings',
        NULL,
        NULL,
        3
    FROM goal_health_5 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Regelmatige controles"
SELECT obj.id, '1x per jaar', '1x per year', NULL, NULL, 1.00, 'keren per jaar', 1 FROM obj_health_5_1 obj
UNION ALL
SELECT obj.id, '100% op tijd', '100% on time', NULL, NULL, 100.00, 'percentage', 2 FROM obj_health_5_1 obj
-- Key Results for Objective 2: "Vaccinaties"
UNION ALL
SELECT obj.id, 'Up-to-date blijven', 'Stay up-to-date', NULL, NULL, 100.00, 'percentage', 1 FROM obj_health_5_2 obj
UNION ALL
SELECT obj.id, 'Alle vaccinaties', 'All vaccinations', NULL, NULL, 1.00, 'status', 2 FROM obj_health_5_2 obj
-- Key Results for Objective 3: "Screenings"
UNION ALL
SELECT obj.id, 'Volgens richtlijnen', 'According to guidelines', NULL, NULL, 100.00, 'percentage', 1 FROM obj_health_5_3 obj
UNION ALL
SELECT obj.id, 'Alle screenings', 'All screenings', NULL, NULL, 1.00, 'status', 2 FROM obj_health_5_3 obj;

-- =====================================================
-- 5. FINANCE (Financiën)
-- =====================================================

-- Goal 1: "Geld sparen voor verschillende doelen"
WITH finance_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'FINANCE'
),
goal_finance_1 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Geld sparen voor verschillende doelen',
        'Save money for various goals',
        'Geld sparen voor verschillende doelen voor financiële stabiliteit.',
        'Save money for various goals for financial stability.',
        1
    FROM finance_domain
    RETURNING id
),
obj_finance_1_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Noodfonds opbouwen',
        'Build emergency fund',
        NULL,
        NULL,
        1
    FROM goal_finance_1 goal
    RETURNING id
),
obj_finance_1_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Korte termijn sparen',
        'Short-term savings',
        NULL,
        NULL,
        2
    FROM goal_finance_1 goal
    RETURNING id
),
obj_finance_1_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Lange termijn sparen',
        'Long-term savings',
        NULL,
        NULL,
        3
    FROM goal_finance_1 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Noodfonds opbouwen"
SELECT obj.id, '6 maanden uitgaven', '6 months expenses', NULL, NULL, 6.00, 'maanden uitgaven', 1 FROM obj_finance_1_1 obj
UNION ALL
SELECT obj.id, '100% van doel', '100% of goal', NULL, NULL, 100.00, 'percentage', 2 FROM obj_finance_1_1 obj
-- Key Results for Objective 2: "Korte termijn sparen"
UNION ALL
SELECT obj.id, '€500 per maand', '€500 per month', NULL, NULL, 500.00, 'euro per maand', 1 FROM obj_finance_1_2 obj
UNION ALL
SELECT obj.id, '12 maanden consistent', '12 months consistent', NULL, NULL, 12.00, 'maanden', 2 FROM obj_finance_1_2 obj
-- Key Results for Objective 3: "Lange termijn sparen"
UNION ALL
SELECT obj.id, '€200 per maand', '€200 per month', NULL, NULL, 200.00, 'euro per maand', 1 FROM obj_finance_1_3 obj
UNION ALL
SELECT obj.id, '12 maanden consistent', '12 months consistent', NULL, NULL, 12.00, 'maanden', 2 FROM obj_finance_1_3 obj;

-- Goal 2: "Zakāt berekenen en betalen"
WITH finance_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'FINANCE'
),
goal_finance_2 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Zakāt berekenen en betalen',
        'Calculate and pay Zakāt',
        'Zakāt correct berekenen en betalen volgens islamitische richtlijnen.',
        'Correctly calculate and pay Zakāt according to Islamic guidelines.',
        2
    FROM finance_domain
    RETURNING id
),
obj_finance_2_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Zakāt berekenen',
        'Calculate Zakāt',
        NULL,
        NULL,
        1
    FROM goal_finance_2 goal
    RETURNING id
),
obj_finance_2_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Zakāt betalen',
        'Pay Zakāt',
        NULL,
        NULL,
        2
    FROM goal_finance_2 goal
    RETURNING id
),
obj_finance_2_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Zakāt planning',
        'Zakāt planning',
        NULL,
        NULL,
        3
    FROM goal_finance_2 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Zakāt berekenen"
SELECT obj.id, 'Jaarlijks', 'Annually', NULL, NULL, 1.00, 'keren per jaar', 1 FROM obj_finance_2_1 obj
UNION ALL
SELECT obj.id, '100% op tijd', '100% on time', NULL, NULL, 100.00, 'percentage', 2 FROM obj_finance_2_1 obj
-- Key Results for Objective 2: "Zakāt betalen"
UNION ALL
SELECT obj.id, 'Op tijd betalen', 'Pay on time', NULL, NULL, 1.00, 'keren per jaar', 1 FROM obj_finance_2_2 obj
UNION ALL
SELECT obj.id, '100% op tijd', '100% on time', NULL, NULL, 100.00, 'percentage', 2 FROM obj_finance_2_2 obj
-- Key Results for Objective 3: "Zakāt planning"
UNION ALL
SELECT obj.id, 'Maandelijks sparen', 'Monthly savings', NULL, NULL, 12.00, 'maanden per jaar', 1 FROM obj_finance_2_3 obj
UNION ALL
SELECT obj.id, '100% consistentie', '100% consistency', NULL, NULL, 100.00, 'percentage', 2 FROM obj_finance_2_3 obj;

-- Goal 3: "Financiële planning en budgetteren"
WITH finance_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'FINANCE'
),
goal_finance_3 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Financiële planning en budgetteren',
        'Financial planning and budgeting',
        'Budgetteren en financiële planning voor financiële stabiliteit.',
        'Budget and financial planning for financial stability.',
        3
    FROM finance_domain
    RETURNING id
),
obj_finance_3_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Maandelijks budget',
        'Monthly budget',
        NULL,
        NULL,
        1
    FROM goal_finance_3 goal
    RETURNING id
),
obj_finance_3_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Jaarlijks budget',
        'Annual budget',
        NULL,
        NULL,
        2
    FROM goal_finance_3 goal
    RETURNING id
),
obj_finance_3_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Financiële doelen',
        'Financial goals',
        NULL,
        NULL,
        3
    FROM goal_finance_3 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Maandelijks budget"
SELECT obj.id, 'Elke maand', 'Every month', NULL, NULL, 12.00, 'maanden per jaar', 1 FROM obj_finance_3_1 obj
UNION ALL
SELECT obj.id, '100% van de maanden', '100% of the months', NULL, NULL, 100.00, 'percentage', 2 FROM obj_finance_3_1 obj
-- Key Results for Objective 2: "Jaarlijks budget"
UNION ALL
SELECT obj.id, 'Elk jaar', 'Every year', NULL, NULL, 1.00, 'jaren', 1 FROM obj_finance_3_2 obj
UNION ALL
SELECT obj.id, '100% compleet', '100% complete', NULL, NULL, 100.00, 'percentage', 2 FROM obj_finance_3_2 obj
-- Key Results for Objective 3: "Financiële doelen"
UNION ALL
SELECT obj.id, '5 doelen per jaar', '5 goals per year', NULL, NULL, 5.00, 'doelen per jaar', 1 FROM obj_finance_3_3 obj
UNION ALL
SELECT obj.id, '100% compleet', '100% complete', NULL, NULL, 100.00, 'percentage', 2 FROM obj_finance_3_3 obj;

-- Goal 4: "Verantwoord investeren"
WITH finance_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'FINANCE'
),
goal_finance_4 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Verantwoord investeren',
        'Responsible investing',
        'Verantwoord investeren volgens halal principes.',
        'Invest responsibly according to halal principles.',
        4
    FROM finance_domain
    RETURNING id
),
obj_finance_4_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Korte termijn investeringen',
        'Short-term investments',
        NULL,
        NULL,
        1
    FROM goal_finance_4 goal
    RETURNING id
),
obj_finance_4_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Lange termijn investeringen',
        'Long-term investments',
        NULL,
        NULL,
        2
    FROM goal_finance_4 goal
    RETURNING id
),
obj_finance_4_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Investeringsportfolio',
        'Investment portfolio',
        NULL,
        NULL,
        3
    FROM goal_finance_4 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Korte termijn investeringen"
SELECT obj.id, '€300 per maand', '€300 per month', NULL, NULL, 300.00, 'euro per maand', 1 FROM obj_finance_4_1 obj
UNION ALL
SELECT obj.id, '12 maanden consistent', '12 months consistent', NULL, NULL, 12.00, 'maanden', 2 FROM obj_finance_4_1 obj
-- Key Results for Objective 2: "Lange termijn investeringen"
UNION ALL
SELECT obj.id, '€500 per maand', '€500 per month', NULL, NULL, 500.00, 'euro per maand', 1 FROM obj_finance_4_2 obj
UNION ALL
SELECT obj.id, '12 maanden consistent', '12 months consistent', NULL, NULL, 12.00, 'maanden', 2 FROM obj_finance_4_2 obj
-- Key Results for Objective 3: "Investeringsportfolio"
UNION ALL
SELECT obj.id, 'Gediversifieerd portfolio', 'Diversified portfolio', NULL, NULL, 100.00, 'percentage', 1 FROM obj_finance_4_3 obj
UNION ALL
SELECT obj.id, '4 asset classes', '4 asset classes', NULL, NULL, 4.00, 'asset classes', 2 FROM obj_finance_4_3 obj;

-- Goal 5: "Schulden beheren en aflossen"
WITH finance_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'FINANCE'
),
goal_finance_5 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Schulden beheren en aflossen',
        'Manage and pay off debts',
        'Schulden beheren en aflossen voor financiële vrijheid.',
        'Manage and pay off debts for financial freedom.',
        5
    FROM finance_domain
    RETURNING id
),
obj_finance_5_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Schulden aflossen',
        'Pay off debts',
        NULL,
        NULL,
        1
    FROM goal_finance_5 goal
    RETURNING id
),
obj_finance_5_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Schulden beheren',
        'Manage debts',
        NULL,
        NULL,
        2
    FROM goal_finance_5 goal
    RETURNING id
),
obj_finance_5_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Schulden voorkomen',
        'Prevent debts',
        NULL,
        NULL,
        3
    FROM goal_finance_5 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Schulden aflossen"
SELECT obj.id, '€500 per maand', '€500 per month', NULL, NULL, 500.00, 'euro per maand', 1 FROM obj_finance_5_1 obj
UNION ALL
SELECT obj.id, '100% van plan', '100% of plan', NULL, NULL, 100.00, 'percentage', 2 FROM obj_finance_5_1 obj
-- Key Results for Objective 2: "Schulden beheren"
UNION ALL
SELECT obj.id, 'Geen nieuwe schulden', 'No new debts', NULL, NULL, 0.00, 'schulden', 1 FROM obj_finance_5_2 obj
UNION ALL
SELECT obj.id, '100% succes', '100% success', NULL, NULL, 100.00, 'percentage', 2 FROM obj_finance_5_2 obj
-- Key Results for Objective 3: "Schulden voorkomen"
UNION ALL
SELECT obj.id, 'Geen onnodige schulden', 'No unnecessary debts', NULL, NULL, 0.00, 'schulden', 1 FROM obj_finance_5_3 obj
UNION ALL
SELECT obj.id, '100% succes', '100% success', NULL, NULL, 100.00, 'percentage', 2 FROM obj_finance_5_3 obj;

-- =====================================================
-- 6. WORK (Werk / Carrière)
-- =====================================================

-- Goal 1: "Professionele vaardigheden ontwikkelen"
WITH work_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'WORK'
),
goal_work_1 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Professionele vaardigheden ontwikkelen',
        'Develop professional skills',
        'Professionele vaardigheden ontwikkelen voor carrièregroei.',
        'Develop professional skills for career growth.',
        1
    FROM work_domain
    RETURNING id
),
obj_work_1_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Technische vaardigheden',
        'Technical skills',
        NULL,
        NULL,
        1
    FROM goal_work_1 goal
    RETURNING id
),
obj_work_1_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Soft skills',
        'Soft skills',
        NULL,
        NULL,
        2
    FROM goal_work_1 goal
    RETURNING id
),
obj_work_1_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Certificeringen behalen',
        'Obtain certifications',
        NULL,
        NULL,
        3
    FROM goal_work_1 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Technische vaardigheden"
SELECT obj.id, '1 nieuwe vaardigheid per kwartaal', '1 new skill per quarter', NULL, NULL, 1.00, 'vaardigheden per kwartaal', 1 FROM obj_work_1_1 obj
UNION ALL
SELECT obj.id, '4 vaardigheden per jaar', '4 skills per year', NULL, NULL, 4.00, 'vaardigheden per jaar', 2 FROM obj_work_1_1 obj
-- Key Results for Objective 2: "Soft skills"
UNION ALL
SELECT obj.id, '1 soft skill per kwartaal', '1 soft skill per quarter', NULL, NULL, 1.00, 'vaardigheden per kwartaal', 1 FROM obj_work_1_2 obj
UNION ALL
SELECT obj.id, '4 soft skills per jaar', '4 soft skills per year', NULL, NULL, 4.00, 'vaardigheden per jaar', 2 FROM obj_work_1_2 obj
-- Key Results for Objective 3: "Certificeringen behalen"
UNION ALL
SELECT obj.id, '1 certificering per jaar', '1 certification per year', NULL, NULL, 1.00, 'certificeringen per jaar', 1 FROM obj_work_1_3 obj
UNION ALL
SELECT obj.id, '100% compleet', '100% complete', NULL, NULL, 100.00, 'percentage', 2 FROM obj_work_1_3 obj;

-- Goal 2: "Netwerken en professionele relaties"
WITH work_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'WORK'
),
goal_work_2 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Netwerken en professionele relaties',
        'Network and professional relationships',
        'Netwerken en professionele relaties opbouwen voor carrièregroei.',
        'Build networking and professional relationships for career growth.',
        2
    FROM work_domain
    RETURNING id
),
obj_work_2_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Netwerk events bezoeken',
        'Attend networking events',
        NULL,
        NULL,
        1
    FROM goal_work_2 goal
    RETURNING id
),
obj_work_2_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Professionele connecties',
        'Professional connections',
        NULL,
        NULL,
        2
    FROM goal_work_2 goal
    RETURNING id
),
obj_work_2_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Mentorship',
        'Mentorship',
        NULL,
        NULL,
        3
    FROM goal_work_2 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Netwerk events bezoeken"
SELECT obj.id, '2 events per kwartaal', '2 events per quarter', NULL, NULL, 2.00, 'events per kwartaal', 1 FROM obj_work_2_1 obj
UNION ALL
SELECT obj.id, '8 events per jaar', '8 events per year', NULL, NULL, 8.00, 'events per jaar', 2 FROM obj_work_2_1 obj
-- Key Results for Objective 2: "Professionele connecties"
UNION ALL
SELECT obj.id, '5 nieuwe connecties per maand', '5 new connections per month', NULL, NULL, 5.00, 'connecties per maand', 1 FROM obj_work_2_2 obj
UNION ALL
SELECT obj.id, '60 connecties per jaar', '60 connections per year', NULL, NULL, 60.00, 'connecties per jaar', 2 FROM obj_work_2_2 obj
-- Key Results for Objective 3: "Mentorship"
UNION ALL
SELECT obj.id, '1 mentor vinden', '1 mentor found', NULL, NULL, 1.00, 'mentoren', 1 FROM obj_work_2_3 obj
UNION ALL
SELECT obj.id, 'Maandelijks contact', 'Monthly contact', NULL, NULL, 12.00, 'sessies per jaar', 2 FROM obj_work_2_3 obj;

-- Goal 3: "Productiviteit en prestaties verbeteren"
WITH work_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'WORK'
),
goal_work_3 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Productiviteit en prestaties verbeteren',
        'Improve productivity and performance',
        'Productiviteit en prestaties verbeteren voor betere resultaten.',
        'Improve productivity and performance for better results.',
        3
    FROM work_domain
    RETURNING id
),
obj_work_3_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Tijd management',
        'Time management',
        NULL,
        NULL,
        1
    FROM goal_work_3 goal
    RETURNING id
),
obj_work_3_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Doelen bereiken',
        'Achieve goals',
        NULL,
        NULL,
        2
    FROM goal_work_3 goal
    RETURNING id
),
obj_work_3_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Feedback ontvangen',
        'Receive feedback',
        NULL,
        NULL,
        3
    FROM goal_work_3 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Tijd management"
SELECT obj.id, 'Dagelijks plannen', 'Daily planning', NULL, NULL, 30.00, 'dagen per maand', 1 FROM obj_work_3_1 obj
UNION ALL
SELECT obj.id, '100% consistentie', '100% consistency', NULL, NULL, 100.00, 'percentage', 2 FROM obj_work_3_1 obj
-- Key Results for Objective 2: "Doelen bereiken"
UNION ALL
SELECT obj.id, '90% van doelen', '90% of goals', NULL, NULL, 90.00, 'percentage', 1 FROM obj_work_3_2 obj
UNION ALL
SELECT obj.id, 'Kwartaal evaluatie', 'Quarterly evaluation', NULL, NULL, 4.00, 'evaluaties per jaar', 2 FROM obj_work_3_2 obj
-- Key Results for Objective 3: "Feedback ontvangen"
UNION ALL
SELECT obj.id, '1x per kwartaal', '1x per quarter', NULL, NULL, 4.00, 'keren per jaar', 1 FROM obj_work_3_3 obj
UNION ALL
SELECT obj.id, '100% op tijd', '100% on time', NULL, NULL, 100.00, 'percentage', 2 FROM obj_work_3_3 obj;

-- Goal 4: "Work-life balance behouden"
WITH work_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'WORK'
),
goal_work_4 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Work-life balance behouden',
        'Maintain work-life balance',
        'Work-life balance behouden voor welzijn en productiviteit.',
        'Maintain work-life balance for well-being and productivity.',
        4
    FROM work_domain
    RETURNING id
),
obj_work_4_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Werkuren beheren',
        'Manage work hours',
        NULL,
        NULL,
        1
    FROM goal_work_4 goal
    RETURNING id
),
obj_work_4_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Vrije tijd beschermen',
        'Protect free time',
        NULL,
        NULL,
        2
    FROM goal_work_4 goal
    RETURNING id
),
obj_work_4_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Stress verminderen',
        'Reduce stress',
        NULL,
        NULL,
        3
    FROM goal_work_4 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Werkuren beheren"
SELECT obj.id, '40 uur per week', '40 hours per week', NULL, NULL, 40.00, 'uren per week', 1 FROM obj_work_4_1 obj
UNION ALL
SELECT obj.id, '100% van de weken', '100% of the weeks', NULL, NULL, 100.00, 'percentage', 2 FROM obj_work_4_1 obj
-- Key Results for Objective 2: "Vrije tijd beschermen"
UNION ALL
SELECT obj.id, '2 dagen per week vrij', '2 days per week free', NULL, NULL, 2.00, 'dagen per week', 1 FROM obj_work_4_2 obj
UNION ALL
SELECT obj.id, '100% van de weken', '100% of the weeks', NULL, NULL, 100.00, 'percentage', 2 FROM obj_work_4_2 obj
-- Key Results for Objective 3: "Stress verminderen"
UNION ALL
SELECT obj.id, 'Dagelijks oefenen', 'Daily practice', NULL, NULL, 30.00, 'dagen per maand', 1 FROM obj_work_4_3 obj
UNION ALL
SELECT obj.id, '100% consistentie', '100% consistency', NULL, NULL, 100.00, 'percentage', 2 FROM obj_work_4_3 obj;

-- Goal 5: "Carrière doelen bereiken"
WITH work_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'WORK'
),
goal_work_5 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Carrière doelen bereiken',
        'Achieve career goals',
        'Carrière doelen stellen en bereiken voor groei.',
        'Set and achieve career goals for growth.',
        5
    FROM work_domain
    RETURNING id
),
obj_work_5_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Korte termijn doelen',
        'Short-term goals',
        NULL,
        NULL,
        1
    FROM goal_work_5 goal
    RETURNING id
),
obj_work_5_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Lange termijn doelen',
        'Long-term goals',
        NULL,
        NULL,
        2
    FROM goal_work_5 goal
    RETURNING id
),
obj_work_5_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Progressie evalueren',
        'Evaluate progress',
        NULL,
        NULL,
        3
    FROM goal_work_5 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Korte termijn doelen"
SELECT obj.id, '3 doelen per kwartaal', '3 goals per quarter', NULL, NULL, 3.00, 'doelen per kwartaal', 1 FROM obj_work_5_1 obj
UNION ALL
SELECT obj.id, '80% compleet', '80% complete', NULL, NULL, 80.00, 'percentage', 2 FROM obj_work_5_1 obj
-- Key Results for Objective 2: "Lange termijn doelen"
UNION ALL
SELECT obj.id, '2 doelen per jaar', '2 goals per year', NULL, NULL, 2.00, 'doelen per jaar', 1 FROM obj_work_5_2 obj
UNION ALL
SELECT obj.id, '100% compleet', '100% complete', NULL, NULL, 100.00, 'percentage', 2 FROM obj_work_5_2 obj
-- Key Results for Objective 3: "Progressie evalueren"
UNION ALL
SELECT obj.id, 'Maandelijks evalueren', 'Monthly evaluation', NULL, NULL, 12.00, 'evaluaties per jaar', 1 FROM obj_work_5_3 obj
UNION ALL
SELECT obj.id, '100% consistentie', '100% consistency', NULL, NULL, 100.00, 'percentage', 2 FROM obj_work_5_3 obj;

-- =====================================================
-- 7. EDUCATION (Onderwijs / Leren)
-- =====================================================

-- Goal 1: "Nieuwe kennis verwerven"
WITH education_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'EDUCATION'
),
goal_education_1 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Nieuwe kennis verwerven',
        'Acquire new knowledge',
        'Nieuwe kennis verwerven voor persoonlijke en professionele groei.',
        'Acquire new knowledge for personal and professional growth.',
        1
    FROM education_domain
    RETURNING id
),
obj_education_1_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Cursussen volgen',
        'Take courses',
        NULL,
        NULL,
        1
    FROM goal_education_1 goal
    RETURNING id
),
obj_education_1_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Boeken lezen',
        'Read books',
        NULL,
        NULL,
        2
    FROM goal_education_1 goal
    RETURNING id
),
obj_education_1_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Online leren',
        'Online learning',
        NULL,
        NULL,
        3
    FROM goal_education_1 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Cursussen volgen"
SELECT obj.id, '1 cursus per kwartaal', '1 course per quarter', NULL, NULL, 1.00, 'cursussen per kwartaal', 1 FROM obj_education_1_1 obj
UNION ALL
SELECT obj.id, '4 cursussen per jaar', '4 courses per year', NULL, NULL, 4.00, 'cursussen per jaar', 2 FROM obj_education_1_1 obj
-- Key Results for Objective 2: "Boeken lezen"
UNION ALL
SELECT obj.id, '1 boek per maand', '1 book per month', NULL, NULL, 1.00, 'boeken per maand', 1 FROM obj_education_1_2 obj
UNION ALL
SELECT obj.id, '12 boeken per jaar', '12 books per year', NULL, NULL, 12.00, 'boeken per jaar', 2 FROM obj_education_1_2 obj
-- Key Results for Objective 3: "Online leren"
UNION ALL
SELECT obj.id, '5 uur per week', '5 hours per week', NULL, NULL, 5.00, 'uren per week', 1 FROM obj_education_1_3 obj
UNION ALL
SELECT obj.id, '260 uur per jaar', '260 hours per year', NULL, NULL, 260.00, 'uren per jaar', 2 FROM obj_education_1_3 obj;

-- Goal 2: "Vaardigheden ontwikkelen"
WITH education_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'EDUCATION'
),
goal_education_2 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Vaardigheden ontwikkelen',
        'Develop skills',
        'Nieuwe vaardigheden ontwikkelen voor groei.',
        'Develop new skills for growth.',
        2
    FROM education_domain
    RETURNING id
),
obj_education_2_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Praktische vaardigheden',
        'Practical skills',
        NULL,
        NULL,
        1
    FROM goal_education_2 goal
    RETURNING id
),
obj_education_2_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Creatieve vaardigheden',
        'Creative skills',
        NULL,
        NULL,
        2
    FROM goal_education_2 goal
    RETURNING id
),
obj_education_2_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Technische vaardigheden',
        'Technical skills',
        NULL,
        NULL,
        3
    FROM goal_education_2 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Praktische vaardigheden"
SELECT obj.id, '1 vaardigheid per kwartaal', '1 skill per quarter', NULL, NULL, 1.00, 'vaardigheden per kwartaal', 1 FROM obj_education_2_1 obj
UNION ALL
SELECT obj.id, '4 vaardigheden per jaar', '4 skills per year', NULL, NULL, 4.00, 'vaardigheden per jaar', 2 FROM obj_education_2_1 obj
-- Key Results for Objective 2: "Creatieve vaardigheden"
UNION ALL
SELECT obj.id, '1 vaardigheid per kwartaal', '1 skill per quarter', NULL, NULL, 1.00, 'vaardigheden per kwartaal', 1 FROM obj_education_2_2 obj
UNION ALL
SELECT obj.id, '4 vaardigheden per jaar', '4 skills per year', NULL, NULL, 4.00, 'vaardigheden per jaar', 2 FROM obj_education_2_2 obj
-- Key Results for Objective 3: "Technische vaardigheden"
UNION ALL
SELECT obj.id, '1 vaardigheid per kwartaal', '1 skill per quarter', NULL, NULL, 1.00, 'vaardigheden per kwartaal', 1 FROM obj_education_2_3 obj
UNION ALL
SELECT obj.id, '4 vaardigheden per jaar', '4 skills per year', NULL, NULL, 4.00, 'vaardigheden per jaar', 2 FROM obj_education_2_3 obj;

-- Goal 3: "Leren van anderen"
WITH education_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'EDUCATION'
),
goal_education_3 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Leren van anderen',
        'Learn from others',
        'Leren van anderen voor kennis en inzicht.',
        'Learn from others for knowledge and insight.',
        3
    FROM education_domain
    RETURNING id
),
obj_education_3_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Mentors zoeken',
        'Find mentors',
        NULL,
        NULL,
        1
    FROM goal_education_3 goal
    RETURNING id
),
obj_education_3_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Workshops bezoeken',
        'Attend workshops',
        NULL,
        NULL,
        2
    FROM goal_education_3 goal
    RETURNING id
),
obj_education_3_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Peer learning',
        'Peer learning',
        NULL,
        NULL,
        3
    FROM goal_education_3 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Mentors zoeken"
SELECT obj.id, '1 mentor per jaar', '1 mentor per year', NULL, NULL, 1.00, 'mentoren per jaar', 1 FROM obj_education_3_1 obj
UNION ALL
SELECT obj.id, 'Maandelijks contact', 'Monthly contact', NULL, NULL, 12.00, 'sessies per jaar', 2 FROM obj_education_3_1 obj
-- Key Results for Objective 2: "Workshops bezoeken"
UNION ALL
SELECT obj.id, '2 workshops per kwartaal', '2 workshops per quarter', NULL, NULL, 2.00, 'workshops per kwartaal', 1 FROM obj_education_3_2 obj
UNION ALL
SELECT obj.id, '8 workshops per jaar', '8 workshops per year', NULL, NULL, 8.00, 'workshops per jaar', 2 FROM obj_education_3_2 obj
-- Key Results for Objective 3: "Peer learning"
UNION ALL
SELECT obj.id, '1 sessie per maand', '1 session per month', NULL, NULL, 1.00, 'sessies per maand', 1 FROM obj_education_3_3 obj
UNION ALL
SELECT obj.id, '12 sessies per jaar', '12 sessions per year', NULL, NULL, 12.00, 'sessies per jaar', 2 FROM obj_education_3_3 obj;

-- Goal 4: "Kennis delen"
WITH education_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'EDUCATION'
),
goal_education_4 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Kennis delen',
        'Share knowledge',
        'Kennis delen met anderen voor gemeenschappelijke groei.',
        'Share knowledge with others for collective growth.',
        4
    FROM education_domain
    RETURNING id
),
obj_education_4_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Lesgeven',
        'Teach',
        NULL,
        NULL,
        1
    FROM goal_education_4 goal
    RETURNING id
),
obj_education_4_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Schrijven',
        'Write',
        NULL,
        NULL,
        2
    FROM goal_education_4 goal
    RETURNING id
),
obj_education_4_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Presenteren',
        'Present',
        NULL,
        NULL,
        3
    FROM goal_education_4 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Lesgeven"
SELECT obj.id, '1 les per kwartaal', '1 lesson per quarter', NULL, NULL, 1.00, 'lessen per kwartaal', 1 FROM obj_education_4_1 obj
UNION ALL
SELECT obj.id, '4 lessen per jaar', '4 lessons per year', NULL, NULL, 4.00, 'lessen per jaar', 2 FROM obj_education_4_1 obj
-- Key Results for Objective 2: "Schrijven"
UNION ALL
SELECT obj.id, '1 artikel per maand', '1 article per month', NULL, NULL, 1.00, 'artikelen per maand', 1 FROM obj_education_4_2 obj
UNION ALL
SELECT obj.id, '12 artikelen per jaar', '12 articles per year', NULL, NULL, 12.00, 'artikelen per jaar', 2 FROM obj_education_4_2 obj
-- Key Results for Objective 3: "Presenteren"
UNION ALL
SELECT obj.id, '1 presentatie per kwartaal', '1 presentation per quarter', NULL, NULL, 1.00, 'presentaties per kwartaal', 1 FROM obj_education_4_3 obj
UNION ALL
SELECT obj.id, '4 presentaties per jaar', '4 presentations per year', NULL, NULL, 4.00, 'presentaties per jaar', 2 FROM obj_education_4_3 obj;

-- Goal 5: "Leren plannen en evalueren"
WITH education_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'EDUCATION'
),
goal_education_5 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Leren plannen en evalueren',
        'Plan and evaluate learning',
        'Leren plannen en evalueren voor effectieve groei.',
        'Plan and evaluate learning for effective growth.',
        5
    FROM education_domain
    RETURNING id
),
obj_education_5_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Leren plannen',
        'Plan learning',
        NULL,
        NULL,
        1
    FROM goal_education_5 goal
    RETURNING id
),
obj_education_5_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Progressie tracken',
        'Track progress',
        NULL,
        NULL,
        2
    FROM goal_education_5 goal
    RETURNING id
),
obj_education_5_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Leren evalueren',
        'Evaluate learning',
        NULL,
        NULL,
        3
    FROM goal_education_5 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Leren plannen"
SELECT obj.id, 'Maandelijks plannen', 'Monthly planning', NULL, NULL, 12.00, 'plannen per jaar', 1 FROM obj_education_5_1 obj
UNION ALL
SELECT obj.id, '100% consistentie', '100% consistency', NULL, NULL, 100.00, 'percentage', 2 FROM obj_education_5_1 obj
-- Key Results for Objective 2: "Progressie tracken"
UNION ALL
SELECT obj.id, 'Weekelijks tracken', 'Weekly tracking', NULL, NULL, 52.00, 'weken per jaar', 1 FROM obj_education_5_2 obj
UNION ALL
SELECT obj.id, '100% consistentie', '100% consistency', NULL, NULL, 100.00, 'percentage', 2 FROM obj_education_5_2 obj
-- Key Results for Objective 3: "Leren evalueren"
UNION ALL
SELECT obj.id, 'Kwartaal evaluatie', 'Quarterly evaluation', NULL, NULL, 4.00, 'evaluaties per jaar', 1 FROM obj_education_5_3 obj
UNION ALL
SELECT obj.id, '100% consistentie', '100% consistency', NULL, NULL, 100.00, 'percentage', 2 FROM obj_education_5_3 obj;

-- =====================================================
-- 8. SOCIAL (Sociale Relaties)
-- =====================================================

-- Goal 1: "Vriendschappen onderhouden"
WITH social_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'SOCIAL'
),
goal_social_1 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Vriendschappen onderhouden',
        'Maintain friendships',
        'Vriendschappen onderhouden voor sterke sociale connecties.',
        'Maintain friendships for strong social connections.',
        1
    FROM social_domain
    RETURNING id
),
obj_social_1_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Regelmatig contact',
        'Regular contact',
        NULL,
        NULL,
        1
    FROM goal_social_1 goal
    RETURNING id
),
obj_social_1_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Quality time',
        'Quality time',
        NULL,
        NULL,
        2
    FROM goal_social_1 goal
    RETURNING id
),
obj_social_1_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Nieuwe vriendschappen',
        'New friendships',
        NULL,
        NULL,
        3
    FROM goal_social_1 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Regelmatig contact"
SELECT obj.id, '5 vrienden per maand', '5 friends per month', NULL, NULL, 5.00, 'vrienden per maand', 1 FROM obj_social_1_1 obj
UNION ALL
SELECT obj.id, '60 contacten per jaar', '60 contacts per year', NULL, NULL, 60.00, 'contacten per jaar', 2 FROM obj_social_1_1 obj
-- Key Results for Objective 2: "Quality time"
UNION ALL
SELECT obj.id, '2 activiteiten per maand', '2 activities per month', NULL, NULL, 2.00, 'activiteiten per maand', 1 FROM obj_social_1_2 obj
UNION ALL
SELECT obj.id, '24 activiteiten per jaar', '24 activities per year', NULL, NULL, 24.00, 'activiteiten per jaar', 2 FROM obj_social_1_2 obj
-- Key Results for Objective 3: "Nieuwe vriendschappen"
UNION ALL
SELECT obj.id, '2 nieuwe vrienden per jaar', '2 new friends per year', NULL, NULL, 2.00, 'vrienden per jaar', 1 FROM obj_social_1_3 obj
UNION ALL
SELECT obj.id, '100% onderhouden', '100% maintained', NULL, NULL, 100.00, 'percentage', 2 FROM obj_social_1_3 obj;

-- Goal 2: "Gemeenschap betrokkenheid"
WITH social_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'SOCIAL'
),
goal_social_2 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Gemeenschap betrokkenheid',
        'Community involvement',
        'Betrokken zijn bij gemeenschap voor sociale impact.',
        'Be involved in community for social impact.',
        2
    FROM social_domain
    RETURNING id
),
obj_social_2_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Vrijwilligerswerk',
        'Volunteering',
        NULL,
        NULL,
        1
    FROM goal_social_2 goal
    RETURNING id
),
obj_social_2_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Gemeenschap events',
        'Community events',
        NULL,
        NULL,
        2
    FROM goal_social_2 goal
    RETURNING id
),
obj_social_2_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Sociale initiatieven',
        'Social initiatives',
        NULL,
        NULL,
        3
    FROM goal_social_2 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Vrijwilligerswerk"
SELECT obj.id, '4 uur per maand', '4 hours per month', NULL, NULL, 4.00, 'uren per maand', 1 FROM obj_social_2_1 obj
UNION ALL
SELECT obj.id, '48 uur per jaar', '48 hours per year', NULL, NULL, 48.00, 'uren per jaar', 2 FROM obj_social_2_1 obj
-- Key Results for Objective 2: "Gemeenschap events"
UNION ALL
SELECT obj.id, '2 events per kwartaal', '2 events per quarter', NULL, NULL, 2.00, 'events per kwartaal', 1 FROM obj_social_2_2 obj
UNION ALL
SELECT obj.id, '8 events per jaar', '8 events per year', NULL, NULL, 8.00, 'events per jaar', 2 FROM obj_social_2_2 obj
-- Key Results for Objective 3: "Sociale initiatieven"
UNION ALL
SELECT obj.id, '1 initiatief per jaar', '1 initiative per year', NULL, NULL, 1.00, 'initiatieven per jaar', 1 FROM obj_social_2_3 obj
UNION ALL
SELECT obj.id, '100% compleet', '100% complete', NULL, NULL, 100.00, 'percentage', 2 FROM obj_social_2_3 obj;

-- Goal 3: "Sociale vaardigheden ontwikkelen"
WITH social_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'SOCIAL'
),
goal_social_3 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Sociale vaardigheden ontwikkelen',
        'Develop social skills',
        'Sociale vaardigheden ontwikkelen voor betere relaties.',
        'Develop social skills for better relationships.',
        3
    FROM social_domain
    RETURNING id
),
obj_social_3_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Communicatie vaardigheden',
        'Communication skills',
        NULL,
        NULL,
        1
    FROM goal_social_3 goal
    RETURNING id
),
obj_social_3_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Empathie ontwikkelen',
        'Develop empathy',
        NULL,
        NULL,
        2
    FROM goal_social_3 goal
    RETURNING id
),
obj_social_3_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Conflict resolutie',
        'Conflict resolution',
        NULL,
        NULL,
        3
    FROM goal_social_3 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Communicatie vaardigheden"
SELECT obj.id, 'Dagelijks oefenen', 'Daily practice', NULL, NULL, 30.00, 'dagen per maand', 1 FROM obj_social_3_1 obj
UNION ALL
SELECT obj.id, '100% consistentie', '100% consistency', NULL, NULL, 100.00, 'percentage', 2 FROM obj_social_3_1 obj
-- Key Results for Objective 2: "Empathie ontwikkelen"
UNION ALL
SELECT obj.id, 'Dagelijks oefenen', 'Daily practice', NULL, NULL, 30.00, 'dagen per maand', 1 FROM obj_social_3_2 obj
UNION ALL
SELECT obj.id, '100% bewustzijn', '100% awareness', NULL, NULL, 100.00, 'percentage', 2 FROM obj_social_3_2 obj
-- Key Results for Objective 3: "Conflict resolutie"
UNION ALL
SELECT obj.id, '1 situatie per maand', '1 situation per month', NULL, NULL, 1.00, 'situaties per maand', 1 FROM obj_social_3_3 obj
UNION ALL
SELECT obj.id, '80% succes rate', '80% success rate', NULL, NULL, 80.00, 'percentage', 2 FROM obj_social_3_3 obj;

-- Goal 4: "Netwerken uitbreiden"
WITH social_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'SOCIAL'
),
goal_social_4 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Netwerken uitbreiden',
        'Expand network',
        'Netwerken uitbreiden voor nieuwe connecties.',
        'Expand network for new connections.',
        4
    FROM social_domain
    RETURNING id
),
obj_social_4_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Nieuwe connecties',
        'New connections',
        NULL,
        NULL,
        1
    FROM goal_social_4 goal
    RETURNING id
),
obj_social_4_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Netwerk events',
        'Network events',
        NULL,
        NULL,
        2
    FROM goal_social_4 goal
    RETURNING id
),
obj_social_4_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Online netwerken',
        'Online networking',
        NULL,
        NULL,
        3
    FROM goal_social_4 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Nieuwe connecties"
SELECT obj.id, '3 nieuwe connecties per maand', '3 new connections per month', NULL, NULL, 3.00, 'connecties per maand', 1 FROM obj_social_4_1 obj
UNION ALL
SELECT obj.id, '36 connecties per jaar', '36 connections per year', NULL, NULL, 36.00, 'connecties per jaar', 2 FROM obj_social_4_1 obj
-- Key Results for Objective 2: "Netwerk events"
UNION ALL
SELECT obj.id, '1 event per kwartaal', '1 event per quarter', NULL, NULL, 1.00, 'events per kwartaal', 1 FROM obj_social_4_2 obj
UNION ALL
SELECT obj.id, '4 events per jaar', '4 events per year', NULL, NULL, 4.00, 'events per jaar', 2 FROM obj_social_4_2 obj
-- Key Results for Objective 3: "Online netwerken"
UNION ALL
SELECT obj.id, 'Weekelijks actief', 'Weekly active', NULL, NULL, 52.00, 'weken per jaar', 1 FROM obj_social_4_3 obj
UNION ALL
SELECT obj.id, '100% consistentie', '100% consistency', NULL, NULL, 100.00, 'percentage', 2 FROM obj_social_4_3 obj;

-- Goal 5: "Relaties onderhouden"
WITH social_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'SOCIAL'
),
goal_social_5 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Relaties onderhouden',
        'Maintain relationships',
        'Bestaande relaties onderhouden voor sterke banden.',
        'Maintain existing relationships for strong bonds.',
        5
    FROM social_domain
    RETURNING id
),
obj_social_5_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Regelmatig contact',
        'Regular contact',
        NULL,
        NULL,
        1
    FROM goal_social_5 goal
    RETURNING id
),
obj_social_5_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Belangrijke momenten',
        'Important moments',
        NULL,
        NULL,
        2
    FROM goal_social_5 goal
    RETURNING id
),
obj_social_5_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Ondersteuning bieden',
        'Provide support',
        NULL,
        NULL,
        3
    FROM goal_social_5 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Regelmatig contact"
SELECT obj.id, '10 contacten per maand', '10 contacts per month', NULL, NULL, 10.00, 'contacten per maand', 1 FROM obj_social_5_1 obj
UNION ALL
SELECT obj.id, '120 contacten per jaar', '120 contacts per year', NULL, NULL, 120.00, 'contacten per jaar', 2 FROM obj_social_5_1 obj
-- Key Results for Objective 2: "Belangrijke momenten"
UNION ALL
SELECT obj.id, 'Alle belangrijke momenten', 'All important moments', NULL, NULL, 100.00, 'percentage', 1 FROM obj_social_5_2 obj
UNION ALL
SELECT obj.id, '12 momenten per jaar', '12 moments per year', NULL, NULL, 12.00, 'momenten per jaar', 2 FROM obj_social_5_2 obj
-- Key Results for Objective 3: "Ondersteuning bieden"
UNION ALL
SELECT obj.id, 'Wanneer nodig', 'When needed', NULL, NULL, 100.00, 'percentage', 1 FROM obj_social_5_3 obj
UNION ALL
SELECT obj.id, '5 situaties per jaar', '5 situations per year', NULL, NULL, 5.00, 'situaties per jaar', 2 FROM obj_social_5_3 obj;

-- =====================================================
-- 9. SPORTS (Sport / Beweging)
-- =====================================================

-- Goal 1: "Regelmatig sporten"
WITH sports_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'SPORTS'
),
goal_sports_1 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Regelmatig sporten',
        'Exercise regularly',
        'Regelmatig sporten voor fysieke fitheid.',
        'Exercise regularly for physical fitness.',
        1
    FROM sports_domain
    RETURNING id
),
obj_sports_1_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Weekelijkse training',
        'Weekly training',
        NULL,
        NULL,
        1
    FROM goal_sports_1 goal
    RETURNING id
),
obj_sports_1_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Dagelijkse beweging',
        'Daily movement',
        NULL,
        NULL,
        2
    FROM goal_sports_1 goal
    RETURNING id
),
obj_sports_1_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Consistentie',
        'Consistency',
        NULL,
        NULL,
        3
    FROM goal_sports_1 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Weekelijkse training"
SELECT obj.id, '3x per week', '3x per week', NULL, NULL, 3.00, 'keren per week', 1 FROM obj_sports_1_1 obj
UNION ALL
SELECT obj.id, '12x per maand', '12x per month', NULL, NULL, 12.00, 'keren per maand', 2 FROM obj_sports_1_1 obj
-- Key Results for Objective 2: "Dagelijkse beweging"
UNION ALL
SELECT obj.id, '30 minuten per dag', '30 minutes per day', NULL, NULL, 30.00, 'minuten per dag', 1 FROM obj_sports_1_2 obj
UNION ALL
SELECT obj.id, '30 dagen per maand', '30 days per month', NULL, NULL, 30.00, 'dagen per maand', 2 FROM obj_sports_1_2 obj
-- Key Results for Objective 3: "Consistentie"
UNION ALL
SELECT obj.id, '80% van de tijd', '80% of the time', NULL, NULL, 80.00, 'percentage', 1 FROM obj_sports_1_3 obj
UNION ALL
SELECT obj.id, '12 maanden consistent', '12 months consistent', NULL, NULL, 12.00, 'maanden', 2 FROM obj_sports_1_3 obj;

-- Goal 2: "Fysieke prestaties verbeteren"
WITH sports_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'SPORTS'
),
goal_sports_2 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Fysieke prestaties verbeteren',
        'Improve physical performance',
        'Fysieke prestaties verbeteren voor betere resultaten.',
        'Improve physical performance for better results.',
        2
    FROM sports_domain
    RETURNING id
),
obj_sports_2_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Kracht opbouwen',
        'Build strength',
        NULL,
        NULL,
        1
    FROM goal_sports_2 goal
    RETURNING id
),
obj_sports_2_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Uithoudingsvermogen',
        'Endurance',
        NULL,
        NULL,
        2
    FROM goal_sports_2 goal
    RETURNING id
),
obj_sports_2_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Flexibiliteit',
        'Flexibility',
        NULL,
        NULL,
        3
    FROM goal_sports_2 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Kracht opbouwen"
SELECT obj.id, '10% verbetering per kwartaal', '10% improvement per quarter', NULL, NULL, 10.00, 'percentage per kwartaal', 1 FROM obj_sports_2_1 obj
UNION ALL
SELECT obj.id, '40% verbetering per jaar', '40% improvement per year', NULL, NULL, 40.00, 'percentage per jaar', 2 FROM obj_sports_2_1 obj
-- Key Results for Objective 2: "Uithoudingsvermogen"
UNION ALL
SELECT obj.id, '15% verbetering per kwartaal', '15% improvement per quarter', NULL, NULL, 15.00, 'percentage per kwartaal', 1 FROM obj_sports_2_2 obj
UNION ALL
SELECT obj.id, '60% verbetering per jaar', '60% improvement per year', NULL, NULL, 60.00, 'percentage per jaar', 2 FROM obj_sports_2_2 obj
-- Key Results for Objective 3: "Flexibiliteit"
UNION ALL
SELECT obj.id, '5% verbetering per kwartaal', '5% improvement per quarter', NULL, NULL, 5.00, 'percentage per kwartaal', 1 FROM obj_sports_2_3 obj
UNION ALL
SELECT obj.id, '20% verbetering per jaar', '20% improvement per year', NULL, NULL, 20.00, 'percentage per jaar', 2 FROM obj_sports_2_3 obj;

-- Goal 3: "Sport doelen bereiken"
WITH sports_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'SPORTS'
),
goal_sports_3 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Sport doelen bereiken',
        'Achieve sports goals',
        'Specifieke sport doelen stellen en bereiken.',
        'Set and achieve specific sports goals.',
        3
    FROM sports_domain
    RETURNING id
),
obj_sports_3_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Korte termijn doelen',
        'Short-term goals',
        NULL,
        NULL,
        1
    FROM goal_sports_3 goal
    RETURNING id
),
obj_sports_3_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Lange termijn doelen',
        'Long-term goals',
        NULL,
        NULL,
        2
    FROM goal_sports_3 goal
    RETURNING id
),
obj_sports_3_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Wedstrijden',
        'Competitions',
        NULL,
        NULL,
        3
    FROM goal_sports_3 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Korte termijn doelen"
SELECT obj.id, '3 doelen per kwartaal', '3 goals per quarter', NULL, NULL, 3.00, 'doelen per kwartaal', 1 FROM obj_sports_3_1 obj
UNION ALL
SELECT obj.id, '80% compleet', '80% complete', NULL, NULL, 80.00, 'percentage', 2 FROM obj_sports_3_1 obj
-- Key Results for Objective 2: "Lange termijn doelen"
UNION ALL
SELECT obj.id, '2 doelen per jaar', '2 goals per year', NULL, NULL, 2.00, 'doelen per jaar', 1 FROM obj_sports_3_2 obj
UNION ALL
SELECT obj.id, '100% compleet', '100% complete', NULL, NULL, 100.00, 'percentage', 2 FROM obj_sports_3_2 obj
-- Key Results for Objective 3: "Wedstrijden"
UNION ALL
SELECT obj.id, '2 wedstrijden per jaar', '2 competitions per year', NULL, NULL, 2.00, 'wedstrijden per jaar', 1 FROM obj_sports_3_3 obj
UNION ALL
SELECT obj.id, '100% deelname', '100% participation', NULL, NULL, 100.00, 'percentage', 2 FROM obj_sports_3_3 obj;

-- Goal 4: "Sport variatie"
WITH sports_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'SPORTS'
),
goal_sports_4 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Sport variatie',
        'Sport variety',
        'Verschillende sporten beoefenen voor balans.',
        'Practice different sports for balance.',
        4
    FROM sports_domain
    RETURNING id
),
obj_sports_4_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Nieuwe sporten proberen',
        'Try new sports',
        NULL,
        NULL,
        1
    FROM goal_sports_4 goal
    RETURNING id
),
obj_sports_4_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Sport variatie',
        'Sport variety',
        NULL,
        NULL,
        2
    FROM goal_sports_4 goal
    RETURNING id
),
obj_sports_4_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Seizoensgebonden sporten',
        'Seasonal sports',
        NULL,
        NULL,
        3
    FROM goal_sports_4 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Nieuwe sporten proberen"
SELECT obj.id, '1 nieuwe sport per kwartaal', '1 new sport per quarter', NULL, NULL, 1.00, 'sporten per kwartaal', 1 FROM obj_sports_4_1 obj
UNION ALL
SELECT obj.id, '4 sporten per jaar', '4 sports per year', NULL, NULL, 4.00, 'sporten per jaar', 2 FROM obj_sports_4_1 obj
-- Key Results for Objective 2: "Sport variatie"
UNION ALL
SELECT obj.id, '3 verschillende sporten', '3 different sports', NULL, NULL, 3.00, 'sporten', 1 FROM obj_sports_4_2 obj
UNION ALL
SELECT obj.id, '100% van de tijd', '100% of the time', NULL, NULL, 100.00, 'percentage', 2 FROM obj_sports_4_2 obj
-- Key Results for Objective 3: "Seizoensgebonden sporten"
UNION ALL
SELECT obj.id, '2 seizoensgebonden sporten', '2 seasonal sports', NULL, NULL, 2.00, 'sporten per jaar', 1 FROM obj_sports_4_3 obj
UNION ALL
SELECT obj.id, '100% deelname', '100% participation', NULL, NULL, 100.00, 'percentage', 2 FROM obj_sports_4_3 obj;

-- Goal 5: "Sport gemeenschap"
WITH sports_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'SPORTS'
),
goal_sports_5 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Sport gemeenschap',
        'Sports community',
        'Betrokken zijn bij sport gemeenschap voor motivatie.',
        'Be involved in sports community for motivation.',
        5
    FROM sports_domain
    RETURNING id
),
obj_sports_5_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Team sporten',
        'Team sports',
        NULL,
        NULL,
        1
    FROM goal_sports_5 goal
    RETURNING id
),
obj_sports_5_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Sport events',
        'Sports events',
        NULL,
        NULL,
        2
    FROM goal_sports_5 goal
    RETURNING id
),
obj_sports_5_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Sport partners',
        'Sports partners',
        NULL,
        NULL,
        3
    FROM goal_sports_5 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Team sporten"
SELECT obj.id, '1 team sport per jaar', '1 team sport per year', NULL, NULL, 1.00, 'sporten per jaar', 1 FROM obj_sports_5_1 obj
UNION ALL
SELECT obj.id, '100% deelname', '100% participation', NULL, NULL, 100.00, 'percentage', 2 FROM obj_sports_5_1 obj
-- Key Results for Objective 2: "Sport events"
UNION ALL
SELECT obj.id, '2 events per jaar', '2 events per year', NULL, NULL, 2.00, 'events per jaar', 1 FROM obj_sports_5_2 obj
UNION ALL
SELECT obj.id, '100% deelname', '100% participation', NULL, NULL, 100.00, 'percentage', 2 FROM obj_sports_5_2 obj
-- Key Results for Objective 3: "Sport partners"
UNION ALL
SELECT obj.id, '1 sport partner', '1 sports partner', NULL, NULL, 1.00, 'partners', 1 FROM obj_sports_5_3 obj
UNION ALL
SELECT obj.id, 'Weekelijks trainen', 'Weekly training', NULL, NULL, 52.00, 'sessies per jaar', 2 FROM obj_sports_5_3 obj;

-- =====================================================
-- 10. REST (Rust / Recreatie)
-- =====================================================

-- Goal 1: "Voldoende rust nemen"
WITH rest_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'REST'
),
goal_rest_1 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Voldoende rust nemen',
        'Get adequate rest',
        'Voldoende rust nemen voor welzijn en herstel.',
        'Get adequate rest for well-being and recovery.',
        1
    FROM rest_domain
    RETURNING id
),
obj_rest_1_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Slaap kwaliteit',
        'Sleep quality',
        NULL,
        NULL,
        1
    FROM goal_rest_1 goal
    RETURNING id
),
obj_rest_1_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Rust momenten',
        'Rest moments',
        NULL,
        NULL,
        2
    FROM goal_rest_1 goal
    RETURNING id
),
obj_rest_1_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Ontspanning',
        'Relaxation',
        NULL,
        NULL,
        3
    FROM goal_rest_1 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Slaap kwaliteit"
SELECT obj.id, '7-8 uur per nacht', '7-8 hours per night', NULL, NULL, 7.50, 'uren per nacht', 1 FROM obj_rest_1_1 obj
UNION ALL
SELECT obj.id, '30 nachten per maand', '30 nights per month', NULL, NULL, 30.00, 'nachten per maand', 2 FROM obj_rest_1_1 obj
-- Key Results for Objective 2: "Rust momenten"
UNION ALL
SELECT obj.id, '2 rust momenten per dag', '2 rest moments per day', NULL, NULL, 2.00, 'momenten per dag', 1 FROM obj_rest_1_2 obj
UNION ALL
SELECT obj.id, '60 momenten per maand', '60 moments per month', NULL, NULL, 60.00, 'momenten per maand', 2 FROM obj_rest_1_2 obj
-- Key Results for Objective 3: "Ontspanning"
UNION ALL
SELECT obj.id, '30 minuten per dag', '30 minutes per day', NULL, NULL, 30.00, 'minuten per dag', 1 FROM obj_rest_1_3 obj
UNION ALL
SELECT obj.id, '30 dagen per maand', '30 days per month', NULL, NULL, 30.00, 'dagen per maand', 2 FROM obj_rest_1_3 obj;

-- Goal 2: "Recreatieve activiteiten"
WITH rest_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'REST'
),
goal_rest_2 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Recreatieve activiteiten',
        'Recreational activities',
        'Recreatieve activiteiten voor plezier en ontspanning.',
        'Recreational activities for enjoyment and relaxation.',
        2
    FROM rest_domain
    RETURNING id
),
obj_rest_2_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Hobby''s beoefenen',
        'Practice hobbies',
        NULL,
        NULL,
        1
    FROM goal_rest_2 goal
    RETURNING id
),
obj_rest_2_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Entertainment',
        'Entertainment',
        NULL,
        NULL,
        2
    FROM goal_rest_2 goal
    RETURNING id
),
obj_rest_2_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Creatieve activiteiten',
        'Creative activities',
        NULL,
        NULL,
        3
    FROM goal_rest_2 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Hobby's beoefenen"
SELECT obj.id, '2x per week', '2x per week', NULL, NULL, 2.00, 'keren per week', 1 FROM obj_rest_2_1 obj
UNION ALL
SELECT obj.id, '8x per maand', '8x per month', NULL, NULL, 8.00, 'keren per maand', 2 FROM obj_rest_2_1 obj
-- Key Results for Objective 2: "Entertainment"
UNION ALL
SELECT obj.id, '1 activiteit per week', '1 activity per week', NULL, NULL, 1.00, 'activiteiten per week', 1 FROM obj_rest_2_2 obj
UNION ALL
SELECT obj.id, '52 activiteiten per jaar', '52 activities per year', NULL, NULL, 52.00, 'activiteiten per jaar', 2 FROM obj_rest_2_2 obj
-- Key Results for Objective 3: "Creatieve activiteiten"
UNION ALL
SELECT obj.id, '1x per week', '1x per week', NULL, NULL, 1.00, 'keren per week', 1 FROM obj_rest_2_3 obj
UNION ALL
SELECT obj.id, '52 sessies per jaar', '52 sessions per year', NULL, NULL, 52.00, 'sessies per jaar', 2 FROM obj_rest_2_3 obj;

-- Goal 3: "Vrije tijd plannen"
WITH rest_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'REST'
),
goal_rest_3 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Vrije tijd plannen',
        'Plan free time',
        'Vrije tijd plannen voor balans en welzijn.',
        'Plan free time for balance and well-being.',
        3
    FROM rest_domain
    RETURNING id
),
obj_rest_3_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Weekend planning',
        'Weekend planning',
        NULL,
        NULL,
        1
    FROM goal_rest_3 goal
    RETURNING id
),
obj_rest_3_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Vakantie planning',
        'Vacation planning',
        NULL,
        NULL,
        2
    FROM goal_rest_3 goal
    RETURNING id
),
obj_rest_3_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Vrije tijd beschermen',
        'Protect free time',
        NULL,
        NULL,
        3
    FROM goal_rest_3 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Weekend planning"
SELECT obj.id, 'Elk weekend', 'Every weekend', NULL, NULL, 52.00, 'weekenden per jaar', 1 FROM obj_rest_3_1 obj
UNION ALL
SELECT obj.id, '100% gepland', '100% planned', NULL, NULL, 100.00, 'percentage', 2 FROM obj_rest_3_1 obj
-- Key Results for Objective 2: "Vakantie planning"
UNION ALL
SELECT obj.id, '2 vakanties per jaar', '2 vacations per year', NULL, NULL, 2.00, 'vakanties per jaar', 1 FROM obj_rest_3_2 obj
UNION ALL
SELECT obj.id, '100% gepland', '100% planned', NULL, NULL, 100.00, 'percentage', 2 FROM obj_rest_3_2 obj
-- Key Results for Objective 3: "Vrije tijd beschermen"
UNION ALL
SELECT obj.id, '2 dagen per week', '2 days per week', NULL, NULL, 2.00, 'dagen per week', 1 FROM obj_rest_3_3 obj
UNION ALL
SELECT obj.id, '100% beschermd', '100% protected', NULL, NULL, 100.00, 'percentage', 2 FROM obj_rest_3_3 obj;

-- Goal 4: "Ontspanningstechnieken"
WITH rest_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'REST'
),
goal_rest_4 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Ontspanningstechnieken',
        'Relaxation techniques',
        'Ontspanningstechnieken leren en beoefenen voor welzijn.',
        'Learn and practice relaxation techniques for well-being.',
        4
    FROM rest_domain
    RETURNING id
),
obj_rest_4_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Meditatie',
        'Meditation',
        NULL,
        NULL,
        1
    FROM goal_rest_4 goal
    RETURNING id
),
obj_rest_4_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Ademhalingsoefeningen',
        'Breathing exercises',
        NULL,
        NULL,
        2
    FROM goal_rest_4 goal
    RETURNING id
),
obj_rest_4_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Yoga of stretching',
        'Yoga or stretching',
        NULL,
        NULL,
        3
    FROM goal_rest_4 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Meditatie"
SELECT obj.id, '10 minuten per dag', '10 minutes per day', NULL, NULL, 10.00, 'minuten per dag', 1 FROM obj_rest_4_1 obj
UNION ALL
SELECT obj.id, '30 dagen consistent', '30 days consistent', NULL, NULL, 30.00, 'dagen', 2 FROM obj_rest_4_1 obj
-- Key Results for Objective 2: "Ademhalingsoefeningen"
UNION ALL
SELECT obj.id, '5 minuten per dag', '5 minutes per day', NULL, NULL, 5.00, 'minuten per dag', 1 FROM obj_rest_4_2 obj
UNION ALL
SELECT obj.id, '30 dagen consistent', '30 days consistent', NULL, NULL, 30.00, 'dagen', 2 FROM obj_rest_4_2 obj
-- Key Results for Objective 3: "Yoga of stretching"
UNION ALL
SELECT obj.id, '15 minuten per dag', '15 minutes per day', NULL, NULL, 15.00, 'minuten per dag', 1 FROM obj_rest_4_3 obj
UNION ALL
SELECT obj.id, '3x per week', '3x per week', NULL, NULL, 3.00, 'keren per week', 2 FROM obj_rest_4_3 obj;

-- Goal 5: "Digitale detox"
WITH rest_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'REST'
),
goal_rest_5 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Digitale detox',
        'Digital detox',
        'Digitale detox voor mentale rust en balans.',
        'Digital detox for mental rest and balance.',
        5
    FROM rest_domain
    RETURNING id
),
obj_rest_5_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Schermtijd verminderen',
        'Reduce screen time',
        NULL,
        NULL,
        1
    FROM goal_rest_5 goal
    RETURNING id
),
obj_rest_5_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Tech-vrije momenten',
        'Tech-free moments',
        NULL,
        NULL,
        2
    FROM goal_rest_5 goal
    RETURNING id
),
obj_rest_5_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id,
        'Social media pauze',
        'Social media break',
        NULL,
        NULL,
        3
    FROM goal_rest_5 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Schermtijd verminderen"
SELECT obj.id, '2 uur per dag', '2 hours per day', NULL, NULL, 2.00, 'uren per dag', 1 FROM obj_rest_5_1 obj
UNION ALL
SELECT obj.id, '30 dagen consistent', '30 days consistent', NULL, NULL, 30.00, 'dagen', 2 FROM obj_rest_5_1 obj
-- Key Results for Objective 2: "Tech-vrije momenten"
UNION ALL
SELECT obj.id, '2 momenten per dag', '2 moments per day', NULL, NULL, 2.00, 'momenten per dag', 1 FROM obj_rest_5_2 obj
UNION ALL
SELECT obj.id, '60 momenten per maand', '60 moments per month', NULL, NULL, 60.00, 'momenten per maand', 2 FROM obj_rest_5_2 obj
-- Key Results for Objective 3: "Social media pauze"
UNION ALL
SELECT obj.id, '1 dag per week', '1 day per week', NULL, NULL, 1.00, 'dagen per week', 1 FROM obj_rest_5_3 obj
UNION ALL
SELECT obj.id, '52 dagen per jaar', '52 days per year', NULL, NULL, 52.00, 'dagen per jaar', 2 FROM obj_rest_5_3 obj;

-- Reset search path
RESET search_path;
