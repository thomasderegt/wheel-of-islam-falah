-- =====================================================
-- Flyway Migration V18: Seed OKR Templates
-- =====================================================
-- Seeds OKR templates (Objectives and Key Results) for 5 life domains
-- Based on GOAL_TEMPLATES_OKR.md
-- =====================================================

-- Set search path to goals_okr schema
SET search_path TO goals_okr;

-- =====================================================
-- 1. RELIGION (Religie / ʿIbādah)
-- =====================================================

-- Objective 1: "Dagelijks gebed consistent verrichten"
WITH religion_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'RELIGION'
),
obj_religion_1 AS (
    INSERT INTO goals_okr.objectives (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'Dagelijks gebed consistent verrichten',
        'Perform daily prayers consistently',
        'Alle vijf dagelijkse gebeden op tijd verrichten als basis voor spirituele groei.',
        'Perform all five daily prayers on time as a foundation for spiritual growth.',
        1
    FROM religion_domain
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
SELECT obj.id, 'Fajr op tijd verrichten', 'Perform Fajr on time', NULL, NULL, 30.00, 'dagen', 1 FROM obj_religion_1 obj
UNION ALL
SELECT obj.id, 'Alle 5 gebeden verrichten', 'Perform all 5 prayers', NULL, NULL, 7.00, 'dagen per week', 2 FROM obj_religion_1 obj
UNION ALL
SELECT obj.id, 'Gebed in gemeenschap verrichten', 'Perform prayer in community', NULL, NULL, 4.00, 'keren per week', 3 FROM obj_religion_1 obj;

-- Objective 2: "Qur'an dagelijks lezen en memoriseren"
WITH religion_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'RELIGION'
),
obj_religion_2 AS (
    INSERT INTO goals_okr.objectives (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Qur''an dagelijks lezen en memoriseren',
        'Read and memorize Qur''an daily',
        'Regelmatig Qur''an lezen en verzen memoriseren voor spirituele groei.',
        'Regularly read Qur''an and memorize verses for spiritual growth.',
        2
    FROM religion_domain
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
SELECT obj.id, 'Dagelijks Qur''an lezen', 'Read Qur''an daily', NULL, NULL, 1.00, 'juz per maand', 1 FROM obj_religion_2 obj
UNION ALL
SELECT obj.id, 'Verzen memoriseren', 'Memorize verses', NULL, NULL, 10.00, 'verzen per maand', 2 FROM obj_religion_2 obj
UNION ALL
SELECT obj.id, 'Tafsir bestuderen', 'Study Tafsir', NULL, NULL, 1.00, 'soera per maand', 3 FROM obj_religion_2 obj;

-- Objective 3: "Dhikr en Dua praktijken versterken"
WITH religion_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'RELIGION'
),
obj_religion_3 AS (
    INSERT INTO goals_okr.objectives (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Dhikr en Dua praktijken versterken',
        'Strengthen Dhikr and Dua practices',
        'Dagelijkse dhikr en dua praktijken opbouwen voor spirituele connectie.',
        'Build daily dhikr and dua practices for spiritual connection.',
        3
    FROM religion_domain
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
SELECT obj.id, 'Ochtend dhikr routine', 'Morning dhikr routine', NULL, NULL, 30.00, 'dagen', 1 FROM obj_religion_3 obj
UNION ALL
SELECT obj.id, 'Avond dhikr routine', 'Evening dhikr routine', NULL, NULL, 30.00, 'dagen', 2 FROM obj_religion_3 obj
UNION ALL
SELECT obj.id, 'Dua maken', 'Make Dua', NULL, NULL, 3.00, 'keren per dag', 3 FROM obj_religion_3 obj;

-- Objective 4: "Ramadan voorbereiding en praktijken"
WITH religion_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'RELIGION'
),
obj_religion_4 AS (
    INSERT INTO goals_okr.objectives (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Ramadan voorbereiding en praktijken',
        'Ramadan preparation and practices',
        'Voorbereiden op Ramadan en Ramadan praktijken consistent uitvoeren.',
        'Prepare for Ramadan and consistently perform Ramadan practices.',
        4
    FROM religion_domain
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
SELECT obj.id, 'Vasten verrichten', 'Perform fasting', NULL, NULL, 30.00, 'dagen', 1 FROM obj_religion_4 obj
UNION ALL
SELECT obj.id, 'Taraweeh gebed', 'Taraweeh prayer', NULL, NULL, 20.00, 'dagen', 2 FROM obj_religion_4 obj
UNION ALL
SELECT obj.id, 'I''tikaf verrichten', 'Perform I''tikaf', NULL, NULL, 10.00, 'dagen', 3 FROM obj_religion_4 obj;

-- Objective 5: "Islamitische kennis vergroten"
WITH religion_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'RELIGION'
),
obj_religion_5 AS (
    INSERT INTO goals_okr.objectives (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Islamitische kennis vergroten',
        'Increase Islamic knowledge',
        'Regelmatig islamitische kennis opdoen voor spirituele groei.',
        'Regularly acquire Islamic knowledge for spiritual growth.',
        5
    FROM religion_domain
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
SELECT obj.id, 'Islamitische lessen volgen', 'Follow Islamic lessons', NULL, NULL, 1.00, 'lessen per week', 1 FROM obj_religion_5 obj
UNION ALL
SELECT obj.id, 'Islamitische boeken lezen', 'Read Islamic books', NULL, NULL, 1.00, 'boeken per maand', 2 FROM obj_religion_5 obj
UNION ALL
SELECT obj.id, 'Seerah bestuderen', 'Study Seerah', NULL, NULL, 1.00, 'hoofdstukken per week', 3 FROM obj_religion_5 obj;

-- =====================================================
-- 2. PERSONAL_GROWTH (Persoonlijke Groei / Tazkiyyah)
-- =====================================================

-- Objective 1: "Tazkiyyah - Zuivering van het hart"
WITH pg_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'PERSONAL_GROWTH'
),
obj_pg_1 AS (
    INSERT INTO goals_okr.objectives (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Tazkiyyah - Zuivering van het hart',
        'Tazkiyyah - Purification of the heart',
        'Werken aan zuivering en ontwikkeling van het hart voor spirituele groei.',
        'Work on purification and development of the heart for spiritual growth.',
        1
    FROM pg_domain
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
SELECT obj.id, 'Zelfreflectie praktijken', 'Self-reflection practices', NULL, NULL, 15.00, 'minuten per dag', 1 FROM obj_pg_1 obj
UNION ALL
SELECT obj.id, 'Negatieve eigenschappen verminderen', 'Reduce negative traits', NULL, NULL, 1.00, 'eigenschappen per maand', 2 FROM obj_pg_1 obj
UNION ALL
SELECT obj.id, 'Positieve eigenschappen ontwikkelen', 'Develop positive traits', NULL, NULL, 1.00, 'eigenschappen per maand', 3 FROM obj_pg_1 obj;

-- Objective 2: "Karakterontwikkeling"
WITH pg_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'PERSONAL_GROWTH'
),
obj_pg_2 AS (
    INSERT INTO goals_okr.objectives (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Karakterontwikkeling',
        'Character development',
        'Goede karaktereigenschappen ontwikkelen volgens islamitische waarden.',
        'Develop good character traits according to Islamic values.',
        2
    FROM pg_domain
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
SELECT obj.id, 'Geduld ontwikkelen', 'Develop patience', NULL, NULL, 30.00, 'dagen', 1 FROM obj_pg_2 obj
UNION ALL
SELECT obj.id, 'Nederigheid versterken', 'Strengthen humility', NULL, NULL, 30.00, 'dagen', 2 FROM obj_pg_2 obj
UNION ALL
SELECT obj.id, 'Vriendelijkheid tonen', 'Show kindness', NULL, NULL, 3.00, 'daden per dag', 3 FROM obj_pg_2 obj;

-- Objective 3: "Zelfreflectie en evaluatie"
WITH pg_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'PERSONAL_GROWTH'
),
obj_pg_3 AS (
    INSERT INTO goals_okr.objectives (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Zelfreflectie en evaluatie',
        'Self-reflection and evaluation',
        'Regelmatige zelfreflectie en evaluatie voor continue groei.',
        'Regular self-reflection and evaluation for continuous growth.',
        3
    FROM pg_domain
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
SELECT obj.id, 'Dagelijkse reflectie', 'Daily reflection', NULL, NULL, 30.00, 'dagen', 1 FROM obj_pg_3 obj
UNION ALL
SELECT obj.id, 'Weekelijkse evaluatie', 'Weekly evaluation', NULL, NULL, 4.00, 'weken', 2 FROM obj_pg_3 obj
UNION ALL
SELECT obj.id, 'Maandelijkse review', 'Monthly review', NULL, NULL, 1.00, 'maanden', 3 FROM obj_pg_3 obj;

-- Objective 4: "Emotionele intelligentie ontwikkelen"
WITH pg_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'PERSONAL_GROWTH'
),
obj_pg_4 AS (
    INSERT INTO goals_okr.objectives (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Emotionele intelligentie ontwikkelen',
        'Develop emotional intelligence',
        'Emotionele intelligentie ontwikkelen voor betere relaties en groei.',
        'Develop emotional intelligence for better relationships and growth.',
        4
    FROM pg_domain
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
SELECT obj.id, 'Emoties herkennen', 'Recognize emotions', NULL, NULL, 30.00, 'dagen', 1 FROM obj_pg_4 obj
UNION ALL
SELECT obj.id, 'Emoties reguleren', 'Regulate emotions', NULL, NULL, 30.00, 'dagen', 2 FROM obj_pg_4 obj
UNION ALL
SELECT obj.id, 'Empathie ontwikkelen', 'Develop empathy', NULL, NULL, 30.00, 'dagen', 3 FROM obj_pg_4 obj;

-- Objective 5: "Persoonlijke visie en doelen"
WITH pg_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'PERSONAL_GROWTH'
),
obj_pg_5 AS (
    INSERT INTO goals_okr.objectives (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Persoonlijke visie en doelen',
        'Personal vision and goals',
        'Duidelijke persoonlijke visie en doelen stellen voor Falah.',
        'Set clear personal vision and goals for Falah.',
        5
    FROM pg_domain
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
SELECT obj.id, 'Persoonlijke visie formuleren', 'Formulate personal vision', NULL, NULL, 1.00, 'document', 1 FROM obj_pg_5 obj
UNION ALL
SELECT obj.id, 'Korte termijn doelen', 'Short-term goals', NULL, NULL, 5.00, 'doelen per kwartaal', 2 FROM obj_pg_5 obj
UNION ALL
SELECT obj.id, 'Lange termijn doelen', 'Long-term goals', NULL, NULL, 3.00, 'doelen per jaar', 3 FROM obj_pg_5 obj;

-- =====================================================
-- 3. FAMILY (Gezin / Familie)
-- =====================================================

-- Objective 1: "Quality time met gezin"
WITH family_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'FAMILY'
),
obj_family_1 AS (
    INSERT INTO goals_okr.objectives (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Quality time met gezin',
        'Quality time with family',
        'Regelmatig quality time doorbrengen met gezin voor sterke familiebanden.',
        'Regularly spend quality time with family for strong family bonds.',
        1
    FROM family_domain
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
SELECT obj.id, 'Weekend activiteiten', 'Weekend activities', NULL, NULL, 2.00, 'activiteiten per maand', 1 FROM obj_family_1 obj
UNION ALL
SELECT obj.id, 'Dagelijks gesprek', 'Daily conversation', NULL, NULL, 30.00, 'minuten per dag', 2 FROM obj_family_1 obj
UNION ALL
SELECT obj.id, 'Gezamenlijke maaltijden', 'Shared meals', NULL, NULL, 5.00, 'keren per week', 3 FROM obj_family_1 obj;

-- Objective 2: "Familie verantwoordelijkheden"
WITH family_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'FAMILY'
),
obj_family_2 AS (
    INSERT INTO goals_okr.objectives (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Familie verantwoordelijkheden',
        'Family responsibilities',
        'Familie verantwoordelijkheden en taken consistent uitvoeren.',
        'Consistently perform family responsibilities and tasks.',
        2
    FROM family_domain
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
SELECT obj.id, 'Dagelijkse taken', 'Daily tasks', NULL, NULL, 5.00, 'taken per dag', 1 FROM obj_family_2 obj
UNION ALL
SELECT obj.id, 'Weekelijkse taken', 'Weekly tasks', NULL, NULL, 3.00, 'taken per week', 2 FROM obj_family_2 obj
UNION ALL
SELECT obj.id, 'Maandelijkse taken', 'Monthly tasks', NULL, NULL, 2.00, 'taken per maand', 3 FROM obj_family_2 obj;

-- Objective 3: "Open communicatie met gezin"
WITH family_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'FAMILY'
),
obj_family_3 AS (
    INSERT INTO goals_okr.objectives (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Open communicatie met gezin',
        'Open communication with family',
        'Open en respectvolle communicatie met gezin voor sterke relaties.',
        'Open and respectful communication with family for strong relationships.',
        3
    FROM family_domain
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
SELECT obj.id, 'Dagelijks gesprek', 'Daily conversation', NULL, NULL, 30.00, 'minuten per dag', 1 FROM obj_family_3 obj
UNION ALL
SELECT obj.id, 'Diepe gesprekken', 'Deep conversations', NULL, NULL, 1.00, 'keren per week', 2 FROM obj_family_3 obj
UNION ALL
SELECT obj.id, 'Familie vergaderingen', 'Family meetings', NULL, NULL, 1.00, 'keren per maand', 3 FROM obj_family_3 obj;

-- Objective 4: "Onderwijs en opvoeding"
WITH family_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'FAMILY'
),
obj_family_4 AS (
    INSERT INTO goals_okr.objectives (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Onderwijs en opvoeding',
        'Education and upbringing',
        'Onderwijs en opvoeding van kinderen volgens islamitische waarden.',
        'Education and upbringing of children according to Islamic values.',
        4
    FROM family_domain
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
SELECT obj.id, 'Islamitische opvoeding', 'Islamic upbringing', NULL, NULL, 7.00, 'dagen', 1 FROM obj_family_4 obj
UNION ALL
SELECT obj.id, 'Academische ondersteuning', 'Academic support', NULL, NULL, 3.00, 'keren per week', 2 FROM obj_family_4 obj
UNION ALL
SELECT obj.id, 'Karakterontwikkeling', 'Character development', NULL, NULL, 7.00, 'dagen', 3 FROM obj_family_4 obj;

-- Objective 5: "Familie tradities onderhouden"
WITH family_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'FAMILY'
),
obj_family_5 AS (
    INSERT INTO goals_okr.objectives (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Familie tradities onderhouden',
        'Maintain family traditions',
        'Familie tradities en rituelen onderhouden voor familiebanden.',
        'Maintain family traditions and rituals for family bonds.',
        5
    FROM family_domain
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
SELECT obj.id, 'Weekelijkse tradities', 'Weekly traditions', NULL, NULL, 4.00, 'weken', 1 FROM obj_family_5 obj
UNION ALL
SELECT obj.id, 'Maandelijkse tradities', 'Monthly traditions', NULL, NULL, 1.00, 'maanden', 2 FROM obj_family_5 obj
UNION ALL
SELECT obj.id, 'Jaarlijkse tradities', 'Annual traditions', NULL, NULL, 1.00, 'jaren', 3 FROM obj_family_5 obj;

-- =====================================================
-- 4. HEALTH (Gezondheid)
-- =====================================================

-- Objective 1: "Fysieke gezondheid verbeteren"
WITH health_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'HEALTH'
),
obj_health_1 AS (
    INSERT INTO goals_okr.objectives (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Fysieke gezondheid verbeteren',
        'Improve physical health',
        'Fysieke fitheid en welzijn verbeteren voor een gezond leven.',
        'Improve physical fitness and wellbeing for a healthy life.',
        1
    FROM health_domain
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
SELECT obj.id, 'Dagelijkse beweging', 'Daily movement', NULL, NULL, 30.00, 'minuten per dag', 1 FROM obj_health_1 obj
UNION ALL
SELECT obj.id, 'Weekelijkse training', 'Weekly training', NULL, NULL, 3.00, 'keren per week', 2 FROM obj_health_1 obj
UNION ALL
SELECT obj.id, 'Maandelijkse evaluatie', 'Monthly evaluation', NULL, NULL, 1.00, 'maanden', 3 FROM obj_health_1 obj;

-- Objective 2: "Mentale gezondheid verbeteren"
WITH health_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'HEALTH'
),
obj_health_2 AS (
    INSERT INTO goals_okr.objectives (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Mentale gezondheid verbeteren',
        'Improve mental health',
        'Mentale welzijn en balans verbeteren voor een gezond leven.',
        'Improve mental wellbeing and balance for a healthy life.',
        2
    FROM health_domain
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
SELECT obj.id, 'Stress management', 'Stress management', NULL, NULL, 30.00, 'dagen', 1 FROM obj_health_2 obj
UNION ALL
SELECT obj.id, 'Mindfulness praktijken', 'Mindfulness practices', NULL, NULL, 15.00, 'minuten per dag', 2 FROM obj_health_2 obj
UNION ALL
SELECT obj.id, 'Emotionele balans', 'Emotional balance', NULL, NULL, 30.00, 'dagen', 3 FROM obj_health_2 obj;

-- Objective 3: "Gezonde voeding"
WITH health_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'HEALTH'
),
obj_health_3 AS (
    INSERT INTO goals_okr.objectives (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Gezonde voeding',
        'Healthy nutrition',
        'Gezonde eetgewoonten ontwikkelen voor een gezond leven.',
        'Develop healthy eating habits for a healthy life.',
        3
    FROM health_domain
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
SELECT obj.id, 'Dagelijks gezond eten', 'Eat healthy daily', NULL, NULL, 3.00, 'maaltijden per dag', 1 FROM obj_health_3 obj
UNION ALL
SELECT obj.id, 'Halal & Tayyib voeding', 'Halal & Tayyib nutrition', NULL, NULL, 100.00, 'percentage', 2 FROM obj_health_3 obj
UNION ALL
SELECT obj.id, 'Meal planning', 'Meal planning', NULL, NULL, 4.00, 'weken', 3 FROM obj_health_3 obj;

-- Objective 4: "Gezonde slaapgewoonten"
WITH health_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'HEALTH'
),
obj_health_4 AS (
    INSERT INTO goals_okr.objectives (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Gezonde slaapgewoonten',
        'Healthy sleep habits',
        'Gezonde slaapgewoonten ontwikkelen voor optimaal welzijn.',
        'Develop healthy sleep habits for optimal wellbeing.',
        4
    FROM health_domain
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
SELECT obj.id, 'Slaap routine', 'Sleep routine', NULL, NULL, 30.00, 'dagen', 1 FROM obj_health_4 obj
UNION ALL
SELECT obj.id, 'Slaap kwaliteit', 'Sleep quality', NULL, NULL, 7.50, 'uren per nacht', 2 FROM obj_health_4 obj
UNION ALL
SELECT obj.id, 'Slaap duur', 'Sleep duration', NULL, NULL, 7.50, 'uren per nacht', 3 FROM obj_health_4 obj;

-- Objective 5: "Preventieve gezondheidszorg"
WITH health_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'HEALTH'
),
obj_health_5 AS (
    INSERT INTO goals_okr.objectives (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Preventieve gezondheidszorg',
        'Preventive healthcare',
        'Regelmatige gezondheidscontroles voor preventieve zorg.',
        'Regular health checkups for preventive care.',
        5
    FROM health_domain
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
SELECT obj.id, 'Regelmatige controles', 'Regular checkups', NULL, NULL, 1.00, 'keren per jaar', 1 FROM obj_health_5 obj
UNION ALL
SELECT obj.id, 'Vaccinaties', 'Vaccinations', NULL, NULL, 1.00, 'vaccinaties', 2 FROM obj_health_5 obj
UNION ALL
SELECT obj.id, 'Screenings', 'Screenings', NULL, NULL, 1.00, 'screenings', 3 FROM obj_health_5 obj;

-- =====================================================
-- 5. FINANCE (Financiën)
-- =====================================================

-- Objective 1: "Geld sparen voor verschillende doelen"
WITH finance_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'FINANCE'
),
obj_finance_1 AS (
    INSERT INTO goals_okr.objectives (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Geld sparen voor verschillende doelen',
        'Save money for various goals',
        'Geld sparen voor verschillende doelen voor financiële stabiliteit.',
        'Save money for various goals for financial stability.',
        1
    FROM finance_domain
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
SELECT obj.id, 'Noodfonds opbouwen', 'Build emergency fund', NULL, NULL, 6.00, 'maanden uitgaven', 1 FROM obj_finance_1 obj
UNION ALL
SELECT obj.id, 'Korte termijn sparen', 'Short-term saving', NULL, NULL, 100.00, 'euro per maand', 2 FROM obj_finance_1 obj
UNION ALL
SELECT obj.id, 'Lange termijn sparen', 'Long-term saving', NULL, NULL, 200.00, 'euro per maand', 3 FROM obj_finance_1 obj;

-- Objective 2: "Zakāt berekenen en betalen"
WITH finance_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'FINANCE'
),
obj_finance_2 AS (
    INSERT INTO goals_okr.objectives (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Zakāt berekenen en betalen',
        'Calculate and pay Zakāt',
        'Zakāt correct berekenen en betalen volgens islamitische richtlijnen.',
        'Correctly calculate and pay Zakāt according to Islamic guidelines.',
        2
    FROM finance_domain
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
SELECT obj.id, 'Zakāt berekenen', 'Calculate Zakāt', NULL, NULL, 1.00, 'keren per jaar', 1 FROM obj_finance_2 obj
UNION ALL
SELECT obj.id, 'Zakāt betalen', 'Pay Zakāt', NULL, NULL, 1.00, 'keren per jaar', 2 FROM obj_finance_2 obj
UNION ALL
SELECT obj.id, 'Zakāt planning', 'Zakāt planning', NULL, NULL, 12.00, 'maanden', 3 FROM obj_finance_2 obj;

-- Objective 3: "Financiële planning en budgetteren"
WITH finance_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'FINANCE'
),
obj_finance_3 AS (
    INSERT INTO goals_okr.objectives (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Financiële planning en budgetteren',
        'Financial planning and budgeting',
        'Budgetteren en financiële planning voor financiële stabiliteit.',
        'Budgeting and financial planning for financial stability.',
        3
    FROM finance_domain
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
SELECT obj.id, 'Maandelijks budget', 'Monthly budget', NULL, NULL, 12.00, 'maanden', 1 FROM obj_finance_3 obj
UNION ALL
SELECT obj.id, 'Jaarlijks budget', 'Annual budget', NULL, NULL, 1.00, 'jaren', 2 FROM obj_finance_3 obj
UNION ALL
SELECT obj.id, 'Financiële doelen', 'Financial goals', NULL, NULL, 5.00, 'doelen per jaar', 3 FROM obj_finance_3 obj;

-- Objective 4: "Verantwoord investeren"
WITH finance_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'FINANCE'
),
obj_finance_4 AS (
    INSERT INTO goals_okr.objectives (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Verantwoord investeren',
        'Responsible investing',
        'Verantwoord investeren volgens halal principes.',
        'Responsible investing according to halal principles.',
        4
    FROM finance_domain
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
SELECT obj.id, 'Korte termijn investeringen', 'Short-term investments', NULL, NULL, 50.00, 'euro per maand', 1 FROM obj_finance_4 obj
UNION ALL
SELECT obj.id, 'Lange termijn investeringen', 'Long-term investments', NULL, NULL, 100.00, 'euro per maand', 2 FROM obj_finance_4 obj
UNION ALL
SELECT obj.id, 'Investeringsportfolio', 'Investment portfolio', NULL, NULL, 1.00, 'portfolio', 3 FROM obj_finance_4 obj;

-- Objective 5: "Schulden beheren en aflossen"
WITH finance_domain AS (
    SELECT id FROM goals.life_domains WHERE domain_key = 'FINANCE'
),
obj_finance_5 AS (
    INSERT INTO goals_okr.objectives (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id,
        'Schulden beheren en aflossen',
        'Manage and pay off debts',
        'Schulden beheren en aflossen voor financiële vrijheid.',
        'Manage and pay off debts for financial freedom.',
        5
    FROM finance_domain
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
SELECT obj.id, 'Schulden aflossen', 'Pay off debts', NULL, NULL, 200.00, 'euro per maand', 1 FROM obj_finance_5 obj
UNION ALL
SELECT obj.id, 'Schulden beheren', 'Manage debts', NULL, NULL, 0.00, 'schulden', 2 FROM obj_finance_5 obj
UNION ALL
SELECT obj.id, 'Schulden voorkomen', 'Prevent debts', NULL, NULL, 0.00, 'schulden', 3 FROM obj_finance_5 obj;

-- Reset search path
RESET search_path;
