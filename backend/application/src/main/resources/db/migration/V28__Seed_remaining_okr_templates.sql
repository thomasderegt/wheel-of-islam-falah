-- =====================================================
-- Flyway Migration V28: Seed Remaining OKR Templates
-- =====================================================
-- Seeds OKR templates (Goals, Objectives, Key Results) for remaining 5 life domains
-- Based on GOAL_TEMPLATES_OKR_V2.md
-- Structure: Life Domain → Goal → Objective → Key Result
-- Life Domains: WORK, EDUCATION, SOCIAL, SPORTS, REST
-- Note: RELIGION, PERSONAL_GROWTH, FAMILY, HEALTH, FINANCE were already seeded in V21
-- =====================================================

-- Set search path to goals_okr schema
SET search_path TO goals_okr;
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
