-- =====================================================
-- Flyway Migration V26: Update Category Subtitles
-- =====================================================
-- Updates subtitles for Tazkiyyah and Fiqh categories
-- Tazkiyyah (category 2): "The interior path to success"
-- Fiqh (category 4): "The exterior path to success"
-- =====================================================

-- Set search path to content schema
SET search_path TO content;

-- Update category 2 (Tazkiyyah / Strengthen Your Inner World)
UPDATE content.categories 
SET subtitle_nl = 'Het innerlijke pad naar succes',
    subtitle_en = 'The interior path to success'
WHERE category_number = 2;

-- Update category 4 (Fiqh)
UPDATE content.categories 
SET subtitle_nl = 'Het uiterlijke pad naar succes',
    subtitle_en = 'The exterior path to success'
WHERE category_number = 4;

-- Reset search path
RESET search_path;
