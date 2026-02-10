-- =====================================================
-- Flyway Migration V42: Add Wheel of Work
-- =====================================================
-- Adds WHEEL_OF_WORK to goals_okr.wheels table
-- =====================================================

-- Set search path to goals_okr schema
SET search_path TO goals_okr;

-- =====================================================
-- Add WHEEL_OF_WORK wheel
-- =====================================================
INSERT INTO goals_okr.wheels (wheel_key, name_nl, name_en, description_nl, description_en, display_order)
VALUES 
    ('WHEEL_OF_WORK', 'Wheel of Work', 'Wheel of Work', 
     'Professionele doelen en werkdomeinen', 
     'Professional goals and work domains', 3)
ON CONFLICT (wheel_key) DO UPDATE SET
    name_nl = EXCLUDED.name_nl,
    name_en = EXCLUDED.name_en,
    description_nl = EXCLUDED.description_nl,
    description_en = EXCLUDED.description_en,
    display_order = EXCLUDED.display_order;

-- Reset search path
RESET search_path;
