-- =====================================================
-- Flyway Migration V44: Seed Work Domain OKR Templates
-- =====================================================
-- Seeds OKR templates (Goals, Objectives, Key Results) for all 10 work domains
-- Structure: Work Domain → Goal → Objective → Key Result
-- Work Domains: SKILLS_DEVELOPMENT, PERFORMANCE, NETWORKING, WORK_LIFE_BALANCE, 
--               LEADERSHIP, COMMUNICATION, TIME_MANAGEMENT, CAREER_GROWTH, 
--               REPUTATION, INNOVATION_WORK
-- =====================================================

-- Set search path to goals_okr schema
SET search_path TO goals_okr;

-- =====================================================
-- 0. SKILLS_DEVELOPMENT (centraal)
-- =====================================================

-- Goal 1: "Nieuwe vaardigheden ontwikkelen"
WITH skills_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'SKILLS_DEVELOPMENT'
),
goal_skills_1 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'Nieuwe vaardigheden ontwikkelen',
        'Develop new skills',
        'Relevante professionele vaardigheden leren en certificeren om carrière te bevorderen.',
        'Learn and certify relevant professional skills to advance career.',
        1
    FROM skills_domain
    RETURNING id
),
obj_skills_1_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        '3 nieuwe vaardigheden leren',
        'Learn 3 new skills',
        NULL,
        NULL,
        1
    FROM goal_skills_1 goal
    RETURNING id
),
obj_skills_1_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        '2 certificeringen behalen',
        'Obtain 2 certifications',
        NULL,
        NULL,
        2
    FROM goal_skills_1 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "3 nieuwe vaardigheden leren"
SELECT obj.id, '3 vaardigheden geïdentificeerd en gestart', '3 skills identified and started', NULL, NULL, 3.00, 'vaardigheden', 1 FROM obj_skills_1_1 obj
UNION ALL
SELECT obj.id, '20+ uren training per vaardigheid', '20+ hours training per skill', NULL, NULL, 20.00, 'uren', 2 FROM obj_skills_1_1 obj
-- Key Results for Objective 2: "2 certificeringen behalen"
UNION ALL
SELECT obj.id, '2 certificeringen behaald', '2 certifications obtained', NULL, NULL, 2.00, 'certificeringen', 1 FROM obj_skills_1_2 obj
UNION ALL
SELECT obj.id, 'Certificeringen binnen 6 maanden', 'Certifications within 6 months', NULL, NULL, 6.00, 'maanden', 2 FROM obj_skills_1_2 obj;

-- =====================================================
-- 1. PERFORMANCE
-- =====================================================

-- Goal 1: "Werkprestaties verbeteren"
WITH performance_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'PERFORMANCE'
),
goal_performance_1 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'Werkprestaties verbeteren',
        'Improve work performance',
        'Productiviteit en kwaliteit van werk verhogen om betere resultaten te behalen.',
        'Increase productivity and work quality to achieve better results.',
        1
    FROM performance_domain
    RETURNING id
),
obj_performance_1_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Productiviteit met 25% verhogen',
        'Increase productivity by 25%',
        NULL,
        NULL,
        1
    FROM goal_performance_1 goal
    RETURNING id
),
obj_performance_1_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Alle deadlines halen',
        'Meet all deadlines',
        NULL,
        NULL,
        2
    FROM goal_performance_1 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Productiviteit met 25% verhogen"
SELECT obj.id, 'Output met 25% verhoogd', 'Output increased by 25%', NULL, NULL, 25.00, 'percentage', 1 FROM obj_performance_1_1 obj
UNION ALL
SELECT obj.id, 'Efficiëntie metrics verbeterd', 'Efficiency metrics improved', NULL, NULL, 1.00, 'milestone', 2 FROM obj_performance_1_1 obj
-- Key Results for Objective 2: "Alle deadlines halen"
UNION ALL
SELECT obj.id, '100% deadlines gehaald', '100% deadlines met', NULL, NULL, 100.00, 'percentage', 1 FROM obj_performance_1_2 obj
UNION ALL
SELECT obj.id, '0 late deliverables', '0 late deliverables', NULL, NULL, 0.00, 'deliverables', 2 FROM obj_performance_1_2 obj;

-- =====================================================
-- 2. NETWORKING
-- =====================================================

-- Goal 1: "Professioneel netwerk uitbreiden"
WITH networking_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'NETWORKING'
),
goal_networking_1 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'Professioneel netwerk uitbreiden',
        'Expand professional network',
        'Nieuwe professionele connecties opbouwen en bestaande relaties versterken.',
        'Build new professional connections and strengthen existing relationships.',
        1
    FROM networking_domain
    RETURNING id
),
obj_networking_1_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        '10 nieuwe professionele connecties',
        '10 new professional connections',
        NULL,
        NULL,
        1
    FROM goal_networking_1 goal
    RETURNING id
),
obj_networking_1_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Mentor vinden of worden',
        'Find or become a mentor',
        NULL,
        NULL,
        2
    FROM goal_networking_1 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "10 nieuwe professionele connecties"
SELECT obj.id, '10 nieuwe connecties gemaakt', '10 new connections made', NULL, NULL, 10.00, 'connecties', 1 FROM obj_networking_1_1 obj
UNION ALL
SELECT obj.id, '5 networking events bijgewoond', '5 networking events attended', NULL, NULL, 5.00, 'events', 2 FROM obj_networking_1_1 obj
-- Key Results for Objective 2: "Mentor vinden of worden"
UNION ALL
SELECT obj.id, 'Mentor relatie opgezet', 'Mentor relationship established', NULL, NULL, 1.00, 'relatie', 1 FROM obj_networking_1_2 obj
UNION ALL
SELECT obj.id, 'Maandelijkse mentor sessies', 'Monthly mentor sessions', NULL, NULL, 12.00, 'sessies', 2 FROM obj_networking_1_2 obj;

-- =====================================================
-- 3. WORK_LIFE_BALANCE
-- =====================================================

-- Goal 1: "Work-life balance verbeteren"
WITH balance_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'WORK_LIFE_BALANCE'
),
goal_balance_1 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'Work-life balance verbeteren',
        'Improve work-life balance',
        'Gezonde balans tussen werk en privéleven creëren voor welzijn en duurzaamheid.',
        'Create healthy balance between work and personal life for wellbeing and sustainability.',
        1
    FROM balance_domain
    RETURNING id
),
obj_balance_1_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Werkuren beperken tot 40 per week',
        'Limit work hours to 40 per week',
        NULL,
        NULL,
        1
    FROM goal_balance_1 goal
    RETURNING id
),
obj_balance_1_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Stress management implementeren',
        'Implement stress management',
        NULL,
        NULL,
        2
    FROM goal_balance_1 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Werkuren beperken tot 40 per week"
SELECT obj.id, 'Gemiddeld 40 uren per week', 'Average 40 hours per week', NULL, NULL, 40.00, 'uren', 1 FROM obj_balance_1_1 obj
UNION ALL
SELECT obj.id, '0 weken met >50 uren', '0 weeks with >50 hours', NULL, NULL, 0.00, 'weken', 2 FROM obj_balance_1_1 obj
-- Key Results for Objective 2: "Stress management implementeren"
UNION ALL
SELECT obj.id, 'Dagelijkse stress management routine', 'Daily stress management routine', NULL, NULL, 1.00, 'routine', 1 FROM obj_balance_1_2 obj
UNION ALL
SELECT obj.id, 'Stress niveau < 5/10', 'Stress level < 5/10', NULL, NULL, 5.00, 'score', 2 FROM obj_balance_1_2 obj;

-- =====================================================
-- 4. LEADERSHIP
-- =====================================================

-- Goal 1: "Leiderschapsvaardigheden ontwikkelen"
WITH leadership_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'LEADERSHIP'
),
goal_leadership_1 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'Leiderschapsvaardigheden ontwikkelen',
        'Develop leadership skills',
        'Leiderschapskwaliteiten ontwikkelen om teams effectief te leiden en invloed uit te oefenen.',
        'Develop leadership qualities to effectively lead teams and exert influence.',
        1
    FROM leadership_domain
    RETURNING id
),
obj_leadership_1_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Leiderschapstraining volgen',
        'Complete leadership training',
        NULL,
        NULL,
        1
    FROM goal_leadership_1 goal
    RETURNING id
),
obj_leadership_1_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Team project leiden',
        'Lead a team project',
        NULL,
        NULL,
        2
    FROM goal_leadership_1 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Leiderschapstraining volgen"
SELECT obj.id, 'Training voltooid', 'Training completed', NULL, NULL, 1.00, 'training', 1 FROM obj_leadership_1_1 obj
UNION ALL
SELECT obj.id, '5+ leiderschapsvaardigheden geleerd', '5+ leadership skills learned', NULL, NULL, 5.00, 'vaardigheden', 2 FROM obj_leadership_1_1 obj
-- Key Results for Objective 2: "Team project leiden"
UNION ALL
SELECT obj.id, '1 project succesvol geleid', '1 project successfully led', NULL, NULL, 1.00, 'project', 1 FROM obj_leadership_1_2 obj
UNION ALL
SELECT obj.id, 'Team tevredenheid 80%+', 'Team satisfaction 80%+', NULL, NULL, 80.00, 'percentage', 2 FROM obj_leadership_1_2 obj;

-- =====================================================
-- 5. COMMUNICATION
-- =====================================================

-- Goal 1: "Communicatievaardigheden verbeteren"
WITH communication_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'COMMUNICATION'
),
goal_communication_1 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'Communicatievaardigheden verbeteren',
        'Improve communication skills',
        'Effectieve communicatie ontwikkelen voor betere samenwerking en presentaties.',
        'Develop effective communication for better collaboration and presentations.',
        1
    FROM communication_domain
    RETURNING id
),
obj_communication_1_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Presentatievaardigheden verbeteren',
        'Improve presentation skills',
        NULL,
        NULL,
        1
    FROM goal_communication_1 goal
    RETURNING id
),
obj_communication_1_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Schrijfvaardigheden ontwikkelen',
        'Develop writing skills',
        NULL,
        NULL,
        2
    FROM goal_communication_1 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Presentatievaardigheden verbeteren"
SELECT obj.id, '5 presentaties gegeven', '5 presentations given', NULL, NULL, 5.00, 'presentaties', 1 FROM obj_communication_1_1 obj
UNION ALL
SELECT obj.id, 'Gemiddelde feedback score 4+', 'Average feedback score 4+', NULL, NULL, 4.00, 'score', 2 FROM obj_communication_1_1 obj
-- Key Results for Objective 2: "Schrijfvaardigheden ontwikkelen"
UNION ALL
SELECT obj.id, '10 professionele documenten geschreven', '10 professional documents written', NULL, NULL, 10.00, 'documenten', 1 FROM obj_communication_1_2 obj
UNION ALL
SELECT obj.id, 'Schrijfcursus voltooid', 'Writing course completed', NULL, NULL, 1.00, 'cursus', 2 FROM obj_communication_1_2 obj;

-- =====================================================
-- 6. TIME_MANAGEMENT
-- =====================================================

-- Goal 1: "Tijd effectiever beheren"
WITH time_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'TIME_MANAGEMENT'
),
goal_time_1 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'Tijd effectiever beheren',
        'Manage time more effectively',
        'Productiviteit verhogen door betere tijdbeheer en prioritering.',
        'Increase productivity through better time management and prioritization.',
        1
    FROM time_domain
    RETURNING id
),
obj_time_1_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Time management systeem implementeren',
        'Implement time management system',
        NULL,
        NULL,
        1
    FROM goal_time_1 goal
    RETURNING id
),
obj_time_1_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Prioriteiten stellen en volgen',
        'Set and follow priorities',
        NULL,
        NULL,
        2
    FROM goal_time_1 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Time management systeem implementeren"
SELECT obj.id, 'Systeem geïmplementeerd en gebruikt', 'System implemented and used', NULL, NULL, 1.00, 'systeem', 1 FROM obj_time_1_1 obj
UNION ALL
SELECT obj.id, '90%+ dagen met systeem gebruikt', '90%+ days with system used', NULL, NULL, 90.00, 'percentage', 2 FROM obj_time_1_1 obj
-- Key Results for Objective 2: "Prioriteiten stellen en volgen"
UNION ALL
SELECT obj.id, 'Dagelijkse prioriteitenlijst', 'Daily priority list', NULL, NULL, 1.00, 'routine', 1 FROM obj_time_1_2 obj
UNION ALL
SELECT obj.id, '80%+ prioriteiten voltooid', '80%+ priorities completed', NULL, NULL, 80.00, 'percentage', 2 FROM obj_time_1_2 obj;

-- =====================================================
-- 7. CAREER_GROWTH
-- =====================================================

-- Goal 1: "Carrière vooruitgang realiseren"
WITH career_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'CAREER_GROWTH'
),
goal_career_1 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'Carrière vooruitgang realiseren',
        'Achieve career advancement',
        'Carrière doelen bereiken door strategische planning en actie.',
        'Achieve career goals through strategic planning and action.',
        1
    FROM career_domain
    RETURNING id
),
obj_career_1_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Carrièreplan ontwikkelen',
        'Develop career plan',
        NULL,
        NULL,
        1
    FROM goal_career_1 goal
    RETURNING id
),
obj_career_1_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Promotie of nieuwe rol behalen',
        'Achieve promotion or new role',
        NULL,
        NULL,
        2
    FROM goal_career_1 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Carrièreplan ontwikkelen"
SELECT obj.id, '5-jaar carrièreplan geschreven', '5-year career plan written', NULL, NULL, 1.00, 'plan', 1 FROM obj_career_1_1 obj
UNION ALL
SELECT obj.id, 'Jaarlijkse doelen gedefinieerd', 'Annual goals defined', NULL, NULL, 1.00, 'doelen', 2 FROM obj_career_1_1 obj
-- Key Results for Objective 2: "Promotie of nieuwe rol behalen"
UNION ALL
SELECT obj.id, 'Promotie of nieuwe rol behaald', 'Promotion or new role achieved', NULL, NULL, 1.00, 'milestone', 1 FROM obj_career_1_2 obj
UNION ALL
SELECT obj.id, 'Binnen 12 maanden', 'Within 12 months', NULL, NULL, 12.00, 'maanden', 2 FROM obj_career_1_2 obj;

-- =====================================================
-- 8. REPUTATION
-- =====================================================

-- Goal 1: "Professionele reputatie opbouwen"
WITH reputation_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'REPUTATION'
),
goal_reputation_1 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'Professionele reputatie opbouwen',
        'Build professional reputation',
        'Expertise en thought leadership tonen om reputatie te versterken.',
        'Demonstrate expertise and thought leadership to strengthen reputation.',
        1
    FROM reputation_domain
    RETURNING id
),
obj_reputation_1_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Thought leadership content creëren',
        'Create thought leadership content',
        NULL,
        NULL,
        1
    FROM goal_reputation_1 goal
    RETURNING id
),
obj_reputation_1_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Expertise delen via presentaties',
        'Share expertise via presentations',
        NULL,
        NULL,
        2
    FROM goal_reputation_1 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Thought leadership content creëren"
SELECT obj.id, '6 artikelen of posts gepubliceerd', '6 articles or posts published', NULL, NULL, 6.00, 'artikelen', 1 FROM obj_reputation_1_1 obj
UNION ALL
SELECT obj.id, '1000+ views/reads behaald', '1000+ views/reads achieved', NULL, NULL, 1000.00, 'views', 2 FROM obj_reputation_1_1 obj
-- Key Results for Objective 2: "Expertise delen via presentaties"
UNION ALL
SELECT obj.id, '3 presentaties gegeven', '3 presentations given', NULL, NULL, 3.00, 'presentaties', 1 FROM obj_reputation_1_2 obj
UNION ALL
SELECT obj.id, 'Positieve feedback 90%+', 'Positive feedback 90%+', NULL, NULL, 90.00, 'percentage', 2 FROM obj_reputation_1_2 obj;

-- =====================================================
-- 9. INNOVATION_WORK
-- =====================================================

-- Goal 1: "Innovatie en creativiteit toepassen"
WITH innovation_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'INNOVATION_WORK'
),
goal_innovation_1 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'Innovatie en creativiteit toepassen',
        'Apply innovation and creativity',
        'Nieuwe ideeën en creatieve oplossingen ontwikkelen voor werkuitdagingen.',
        'Develop new ideas and creative solutions for work challenges.',
        1
    FROM innovation_domain
    RETURNING id
),
obj_innovation_1_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        '5 innovatieve ideeën implementeren',
        'Implement 5 innovative ideas',
        NULL,
        NULL,
        1
    FROM goal_innovation_1 goal
    RETURNING id
),
obj_innovation_1_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Creativiteitstraining volgen',
        'Complete creativity training',
        NULL,
        NULL,
        2
    FROM goal_innovation_1 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "5 innovatieve ideeën implementeren"
SELECT obj.id, '5 ideeën geïmplementeerd', '5 ideas implemented', NULL, NULL, 5.00, 'ideeën', 1 FROM obj_innovation_1_1 obj
UNION ALL
SELECT obj.id, '3 ideeën met meetbare impact', '3 ideas with measurable impact', NULL, NULL, 3.00, 'ideeën', 2 FROM obj_innovation_1_1 obj
-- Key Results for Objective 2: "Creativiteitstraining volgen"
UNION ALL
SELECT obj.id, 'Training voltooid', 'Training completed', NULL, NULL, 1.00, 'training', 1 FROM obj_innovation_1_2 obj
UNION ALL
SELECT obj.id, 'Creativiteitsscore verbeterd', 'Creativity score improved', NULL, NULL, 1.00, 'milestone', 2 FROM obj_innovation_1_2 obj;

-- Reset search path
RESET search_path;
