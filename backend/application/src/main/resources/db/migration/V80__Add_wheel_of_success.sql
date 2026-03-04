-- =====================================================
-- Flyway Migration V80: Add Wheel of Success
-- =====================================================
-- Adds WHEEL_OF_SUCCESS to goals_okr.wheels table
-- Seeds life domains: FIQH, TAZKIYYAH (vormingsdoelen)
-- =====================================================

-- Set search path to goals_okr schema
SET search_path TO goals_okr;

-- =====================================================
-- Add WHEEL_OF_SUCCESS wheel (display_order 0 = first)
-- =====================================================
INSERT INTO goals_okr.wheels (wheel_key, name_nl, name_en, description_nl, description_en, display_order)
VALUES 
    ('WHEEL_OF_SUCCESS', 'Wheel of Success', 'Wheel of Success', 
     'Vormingsdoelen: Fiqh en Tazkiyyah – vorming van handelen en hart', 
     'Formative goals: Fiqh and Tazkiyyah – formation of action and heart', 0)
ON CONFLICT (wheel_key) DO UPDATE SET
    name_nl = EXCLUDED.name_nl,
    name_en = EXCLUDED.name_en,
    description_nl = EXCLUDED.description_nl,
    description_en = EXCLUDED.description_en,
    display_order = EXCLUDED.display_order;

-- =====================================================
-- Seed Success domains (Fiqh, Tazkiyyah)
-- =====================================================
DO $$
DECLARE
    wheel_of_success_id BIGINT;
BEGIN
    SELECT id INTO wheel_of_success_id FROM goals_okr.wheels WHERE wheel_key = 'WHEEL_OF_SUCCESS';
    
    IF wheel_of_success_id IS NULL THEN
        RAISE EXCEPTION 'Wheel of Success not found';
    END IF;

    -- FIQH (vorming van handelen) – displayOrder 0
    INSERT INTO goals_okr.life_domains (domain_key, title_nl, title_en, description_nl, description_en, icon_name, display_order, wheel_id)
    VALUES 
        ('FIQH', 'Fiqh', 'Fiqh', 
         'Vorming van handelen – Islamitische jurisprudentie, geboden en verboden', 
         'Formation of action – Islamic jurisprudence, commandments and prohibitions',
         'scale', 0, wheel_of_success_id)
    ON CONFLICT (domain_key) DO UPDATE SET
        wheel_id = EXCLUDED.wheel_id,
        title_nl = EXCLUDED.title_nl,
        title_en = EXCLUDED.title_en,
        description_nl = EXCLUDED.description_nl,
        description_en = EXCLUDED.description_en,
        display_order = EXCLUDED.display_order;

    -- TAZKIYYAH (vorming van hart) – displayOrder 1
    INSERT INTO goals_okr.life_domains (domain_key, title_nl, title_en, description_nl, description_en, icon_name, display_order, wheel_id)
    VALUES 
        ('TAZKIYYAH', 'Tazkiyyah', 'Tazkiyyah', 
         'Vorming van hart – innerlijke purificatie, karakterontwikkeling, spirituele groei', 
         'Formation of heart – inner purification, character development, spiritual growth',
         'heart', 1, wheel_of_success_id)
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
