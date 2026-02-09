-- =====================================================
-- Flyway Migration V35: Update Category Titles and Subtitles
-- =====================================================
-- Updates all categories to their new titles, subtitles, and descriptions
-- =====================================================

-- Set search path to content schema
SET search_path TO content;

-- Update Category 0: Falah
UPDATE content.categories 
SET title_nl = 'Falah',
    title_en = 'Falah',
    subtitle_nl = 'Ultimate Success',
    subtitle_en = 'Ultimate Success',
    description_nl = 'Ultimate Success',
    description_en = 'Ultimate Success'
WHERE category_number = 0;

-- Update Category 1: Dunya
UPDATE content.categories 
SET title_nl = 'Dunya',
    title_en = 'Dunya',
    subtitle_nl = 'Gift & Test',
    subtitle_en = 'Gift & Test',
    description_nl = 'Gift & Test',
    description_en = 'Gift & Test'
WHERE category_number = 1;

-- Update Category 2: Tazkiyyah
UPDATE content.categories 
SET title_nl = 'Tazkiyyah',
    title_en = 'Tazkiyyah',
    subtitle_nl = 'Het innerlijke pad naar succes',
    subtitle_en = 'The interior path to success',
    description_nl = 'The interior path to success',
    description_en = 'The interior path to success'
WHERE category_number = 2;

-- Update Category 3: Ākhirah
UPDATE content.categories 
SET title_nl = 'Ākhirah',
    title_en = 'Ākhirah',
    subtitle_nl = 'Het innerlijke pad naar succes',
    subtitle_en = 'The interior path to success',
    description_nl = 'Final Return',
    description_en = 'Final Return'
WHERE category_number = 3;

-- Update Category 4: Fiqh
UPDATE content.categories 
SET subtitle_nl = 'Het uiterlijke pad naar succes',
    subtitle_en = 'The exterior path to success',
    description_nl = 'The exterior path to success',
    description_en = 'The exterior path to success'
WHERE category_number = 4;

-- Reset search path
RESET search_path;
