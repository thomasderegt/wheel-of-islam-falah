-- =====================================================
-- Flyway Migration V7: Add Falah Category
-- =====================================================
-- Adds Falah as Category #0 (central category)
-- Falah is the central place where goals are set and tracked
-- =====================================================

-- Set search path to content schema
SET search_path TO content;

-- Seed Falah category (Category #0) - only if it doesn't exist
-- Category 0: Falah
INSERT INTO content.categories (category_number, title_nl, title_en, description_nl, description_en)
SELECT 0, 'Falah', 'Falah', 
       'De centrale plek waar je leert wat Falah is, doelen stelt en je voortgang volgt.',
       'The central place where you learn what Falah is, set goals, and track your progress.'
WHERE NOT EXISTS (
    SELECT 1 FROM content.categories WHERE category_number = 0
);

-- Reset search path
RESET search_path;
