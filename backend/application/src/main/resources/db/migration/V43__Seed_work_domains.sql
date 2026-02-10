-- =====================================================
-- Flyway Migration V43: Seed Work Domains
-- =====================================================
-- Seeds work domains for Wheel of Work
-- =====================================================

-- Set search path to goals_okr schema
SET search_path TO goals_okr;

-- Get Wheel of Work ID
DO $$
DECLARE
    wheel_of_work_id BIGINT;
BEGIN
    SELECT id INTO wheel_of_work_id FROM goals_okr.wheels WHERE wheel_key = 'WHEEL_OF_WORK';
    
    IF wheel_of_work_id IS NULL THEN
        RAISE EXCEPTION 'Wheel of Work not found';
    END IF;

    -- Seed work domains (only if they don't exist)
    -- SKILLS_DEVELOPMENT (centraal - displayOrder 0)
    INSERT INTO goals_okr.life_domains (domain_key, title_nl, title_en, description_nl, description_en, icon_name, display_order, wheel_id)
    VALUES 
        ('SKILLS_DEVELOPMENT', 'Skills & Development', 'Skills & Development', 
         'Nieuwe vaardigheden leren, certificeringen behalen, professionele ontwikkeling', 
         'Learning new skills, obtaining certifications, professional development',
         'graduation-cap', 0, wheel_of_work_id)
    ON CONFLICT (domain_key) DO UPDATE SET
        wheel_id = EXCLUDED.wheel_id,
        title_nl = EXCLUDED.title_nl,
        title_en = EXCLUDED.title_en,
        description_nl = EXCLUDED.description_nl,
        description_en = EXCLUDED.description_en,
        display_order = EXCLUDED.display_order;

    INSERT INTO goals_okr.life_domains (domain_key, title_nl, title_en, description_nl, description_en, icon_name, display_order, wheel_id)
    VALUES 
        ('PERFORMANCE', 'Performance & Productivity', 'Performance & Productivity', 
         'Werkprestaties verbeteren, productiviteit verhogen, doelen behalen', 
         'Improve work performance, increase productivity, achieve goals',
         'target', 1, wheel_of_work_id)
    ON CONFLICT (domain_key) DO UPDATE SET
        wheel_id = EXCLUDED.wheel_id,
        title_nl = EXCLUDED.title_nl,
        title_en = EXCLUDED.title_en,
        description_nl = EXCLUDED.description_nl,
        description_en = EXCLUDED.description_en,
        display_order = EXCLUDED.display_order;

    INSERT INTO goals_okr.life_domains (domain_key, title_nl, title_en, description_nl, description_en, icon_name, display_order, wheel_id)
    VALUES 
        ('NETWORKING', 'Networking & Relationships', 'Networking & Relationships', 
         'Professionele relaties opbouwen, netwerken, mentorschap', 
         'Build professional relationships, networking, mentorship',
         'users', 2, wheel_of_work_id)
    ON CONFLICT (domain_key) DO UPDATE SET
        wheel_id = EXCLUDED.wheel_id,
        title_nl = EXCLUDED.title_nl,
        title_en = EXCLUDED.title_en,
        description_nl = EXCLUDED.description_nl,
        description_en = EXCLUDED.description_en,
        display_order = EXCLUDED.display_order;

    INSERT INTO goals_okr.life_domains (domain_key, title_nl, title_en, description_nl, description_en, icon_name, display_order, wheel_id)
    VALUES 
        ('WORK_LIFE_BALANCE', 'Work-Life Balance', 'Work-Life Balance', 
         'Balans tussen werk en privé, stress management, welzijn', 
         'Balance between work and personal life, stress management, wellbeing',
         'scale', 3, wheel_of_work_id)
    ON CONFLICT (domain_key) DO UPDATE SET
        wheel_id = EXCLUDED.wheel_id,
        title_nl = EXCLUDED.title_nl,
        title_en = EXCLUDED.title_en,
        description_nl = EXCLUDED.description_nl,
        description_en = EXCLUDED.description_en,
        display_order = EXCLUDED.display_order;

    INSERT INTO goals_okr.life_domains (domain_key, title_nl, title_en, description_nl, description_en, icon_name, display_order, wheel_id)
    VALUES 
        ('LEADERSHIP', 'Leadership', 'Leadership', 
         'Leiderschapsvaardigheden ontwikkelen, team management, invloed uitoefenen', 
         'Develop leadership skills, team management, exert influence',
         'award', 4, wheel_of_work_id)
    ON CONFLICT (domain_key) DO UPDATE SET
        wheel_id = EXCLUDED.wheel_id,
        title_nl = EXCLUDED.title_nl,
        title_en = EXCLUDED.title_en,
        description_nl = EXCLUDED.description_nl,
        description_en = EXCLUDED.description_en,
        display_order = EXCLUDED.display_order;

    INSERT INTO goals_okr.life_domains (domain_key, title_nl, title_en, description_nl, description_en, icon_name, display_order, wheel_id)
    VALUES 
        ('COMMUNICATION', 'Communication', 'Communication', 
         'Communicatievaardigheden verbeteren, presenteren, schrijven', 
         'Improve communication skills, presenting, writing',
         'message-circle', 5, wheel_of_work_id)
    ON CONFLICT (domain_key) DO UPDATE SET
        wheel_id = EXCLUDED.wheel_id,
        title_nl = EXCLUDED.title_nl,
        title_en = EXCLUDED.title_en,
        description_nl = EXCLUDED.description_nl,
        description_en = EXCLUDED.description_en,
        display_order = EXCLUDED.display_order;

    INSERT INTO goals_okr.life_domains (domain_key, title_nl, title_en, description_nl, description_en, icon_name, display_order, wheel_id)
    VALUES 
        ('TIME_MANAGEMENT', 'Time Management', 'Time Management', 
         'Tijd effectief beheren, prioriteiten stellen, deadlines halen', 
         'Manage time effectively, set priorities, meet deadlines',
         'clock', 6, wheel_of_work_id)
    ON CONFLICT (domain_key) DO UPDATE SET
        wheel_id = EXCLUDED.wheel_id,
        title_nl = EXCLUDED.title_nl,
        title_en = EXCLUDED.title_en,
        description_nl = EXCLUDED.description_nl,
        description_en = EXCLUDED.description_en,
        display_order = EXCLUDED.display_order;

    INSERT INTO goals_okr.life_domains (domain_key, title_nl, title_en, description_nl, description_en, icon_name, display_order, wheel_id)
    VALUES 
        ('CAREER_GROWTH', 'Career Growth', 'Career Growth', 
         'Carrière vooruitgang, promoties, nieuwe rollen', 
         'Career advancement, promotions, new roles',
         'trending-up', 7, wheel_of_work_id)
    ON CONFLICT (domain_key) DO UPDATE SET
        wheel_id = EXCLUDED.wheel_id,
        title_nl = EXCLUDED.title_nl,
        title_en = EXCLUDED.title_en,
        description_nl = EXCLUDED.description_nl,
        description_en = EXCLUDED.description_en,
        display_order = EXCLUDED.display_order;

    INSERT INTO goals_okr.life_domains (domain_key, title_nl, title_en, description_nl, description_en, icon_name, display_order, wheel_id)
    VALUES 
        ('REPUTATION', 'Professional Reputation', 'Professional Reputation', 
         'Professionele reputatie opbouwen, thought leadership, expertise tonen', 
         'Build professional reputation, thought leadership, demonstrate expertise',
         'star', 8, wheel_of_work_id)
    ON CONFLICT (domain_key) DO UPDATE SET
        wheel_id = EXCLUDED.wheel_id,
        title_nl = EXCLUDED.title_nl,
        title_en = EXCLUDED.title_en,
        description_nl = EXCLUDED.description_nl,
        description_en = EXCLUDED.description_en,
        display_order = EXCLUDED.display_order;

    INSERT INTO goals_okr.life_domains (domain_key, title_nl, title_en, description_nl, description_en, icon_name, display_order, wheel_id)
    VALUES 
        ('INNOVATION_WORK', 'Innovation & Creativity', 'Innovation & Creativity', 
         'Innovatieve oplossingen bedenken, creativiteit toepassen, nieuwe ideeën', 
         'Come up with innovative solutions, apply creativity, new ideas',
         'lightbulb', 9, wheel_of_work_id)
    ON CONFLICT (domain_key) DO UPDATE SET
        wheel_id = EXCLUDED.wheel_id,
        title_nl = EXCLUDED.title_nl,
        title_en = EXCLUDED.title_en,
        description_nl = EXCLUDED.description_nl,
        description_en = EXCLUDED.description_en,
        display_order = EXCLUDED.display_order;

END $$;

-- Reset search path
RESET search_path;
