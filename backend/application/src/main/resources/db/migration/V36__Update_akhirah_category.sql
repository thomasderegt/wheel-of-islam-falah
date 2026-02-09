-- =====================================================
-- Flyway Migration V36: Update Ākhirah Category
-- =====================================================
-- Updates Category 3 (Ākhirah) with correct titles, subtitles, and description
-- =====================================================

-- Set search path to content schema
SET search_path TO content;

-- Update Category 3: Ākhirah
UPDATE content.categories 
SET title_nl = 'Ākhirah',
    title_en = 'Ākhirah',
    subtitle_nl = 'Final Return',
    subtitle_en = 'Final Return',
    description_nl = 'Final Return',
    description_en = 'Final Return'
WHERE category_number = 3;

-- Reset search path
RESET search_path;
