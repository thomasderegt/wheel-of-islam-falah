-- =====================================================
-- Flyway Migration V25: Update Fiqh Category Subtitle
-- =====================================================
-- Updates Fiqh category to move "Divine do's and donts" from title to subtitle
-- =====================================================

-- Set search path to content schema
SET search_path TO content;

-- Update category 4 to set subtitle and fix title
UPDATE content.categories 
SET title_nl = 'Fiqh',
    title_en = 'Fiqh',
    subtitle_nl = 'Goddelijke geboden en verboden',
    subtitle_en = 'Divine do''s and donts',
    description_nl = 'Leer over de goddelijke geboden en verboden, wat wel en niet mag volgens de islamitische wetgeving.',
    description_en = 'Learn about divine do''s and don''ts, what is allowed and not allowed according to Islamic law.'
WHERE category_number = 4;

-- Reset search path
RESET search_path;
