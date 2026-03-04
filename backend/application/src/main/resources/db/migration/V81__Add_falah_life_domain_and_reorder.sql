-- =====================================================
-- Flyway Migration V81: Add Falah life domain and reorder
-- =====================================================
-- Adds FALAH as center domain (display_order 0)
-- Updates FIQH to display_order 1, TAZKIYYAH to display_order 2
-- =====================================================

SET search_path TO goals_okr;

DO $$
DECLARE
    wheel_of_success_id BIGINT;
BEGIN
    SELECT id INTO wheel_of_success_id FROM goals_okr.wheels WHERE wheel_key = 'WHEEL_OF_SUCCESS';
    
    IF wheel_of_success_id IS NULL THEN
        RAISE EXCEPTION 'Wheel of Success not found';
    END IF;

    -- Add FALAH (centraal) – displayOrder 0
    INSERT INTO goals_okr.life_domains (domain_key, title_nl, title_en, description_nl, description_en, icon_name, display_order, wheel_id)
    VALUES 
        ('FALAH', 'Falah', 'Falah', 
         'Holistische succes – balans tussen vorming van hart en handelen', 
         'Holistic success – balance between formation of heart and action',
         'star', 0, wheel_of_success_id)
    ON CONFLICT (domain_key) DO UPDATE SET
        wheel_id = EXCLUDED.wheel_id,
        title_nl = EXCLUDED.title_nl,
        title_en = EXCLUDED.title_en,
        description_nl = EXCLUDED.description_nl,
        description_en = EXCLUDED.description_en,
        display_order = EXCLUDED.display_order;

    -- Update FIQH to display_order 1
    UPDATE goals_okr.life_domains
    SET display_order = 1
    WHERE domain_key = 'FIQH' AND wheel_id = wheel_of_success_id;

    -- Update TAZKIYYAH to display_order 2
    UPDATE goals_okr.life_domains
    SET display_order = 2
    WHERE domain_key = 'TAZKIYYAH' AND wheel_id = wheel_of_success_id;

END $$;

RESET search_path;
