-- =====================================================
-- Flyway Migration V24: Add Fiqh Category
-- =====================================================
-- Adds Fiqh as Category #4 (fourth ring category)
-- Fiqh: Divine do's and donts
-- =====================================================

-- Set search path to content schema
SET search_path TO content;

-- Category 4: Fiqh, Divine do's and donts
INSERT INTO content.categories (category_number, title_nl, title_en, description_nl, description_en)
SELECT 4, 'Fiqh', 'Fiqh, Divine do''s and donts', 
       'Leer over de goddelijke geboden en verboden, wat wel en niet mag volgens de islamitische wetgeving.',
       'Learn about divine do''s and don''ts, what is allowed and not allowed according to Islamic law.'
WHERE NOT EXISTS (
    SELECT 1 FROM content.categories WHERE category_number = 4
);

-- Reset search path
RESET search_path;
