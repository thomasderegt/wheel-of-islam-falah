-- =====================================================
-- Flyway Migration V6: Seed System Categories
-- =====================================================
-- Seeds the 3 required system categories that are used for the home page
-- These categories should always exist and cannot be deleted
-- =====================================================

-- Set search path to content schema
SET search_path TO content;

-- Seed system categories (only if they don't exist)
-- Category 1: Build Your Dunya
INSERT INTO content.categories (category_number, title_nl, title_en, description_nl, description_en)
VALUES 
    (1, 'Bouw Je Dunya', 'Build Your Dunya', 
     'Set goals, habits, routines, and projects that move your life forward.',
     'Set goals, habits, routines, and projects that move your life forward.')
ON CONFLICT DO NOTHING;

-- Category 2: Strengthen Your Inner World
INSERT INTO content.categories (category_number, title_nl, title_en, description_nl, description_en)
VALUES 
    (2, 'Versterk Je Innerlijke Wereld', 'Strengthen Your Inner World',
     'Develop focus, clarity, patience, emotional discipline, and spiritual depth.',
     'Develop focus, clarity, patience, emotional discipline, and spiritual depth.')
ON CONFLICT DO NOTHING;

-- Category 3: Prepare for the Ākhirah
INSERT INTO content.categories (category_number, title_nl, title_en, description_nl, description_en)
VALUES 
    (3, 'Bereid Je Voor op de Ākhirah', 'Prepare for the Ākhirah',
     'Prepare for the afterlife through spiritual growth and good deeds.',
     'Prepare for the afterlife through spiritual growth and good deeds.')
ON CONFLICT DO NOTHING;

-- Reset search path
RESET search_path;

