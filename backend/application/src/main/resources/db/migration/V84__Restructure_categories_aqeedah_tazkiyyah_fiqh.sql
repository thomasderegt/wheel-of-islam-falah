-- =====================================================
-- Flyway Migration V84: Restructure Categories
-- =====================================================
-- New structure: 0=Falah, 1=Aqeedah, 2=Tazkiyyah, 3=Fiqh
-- - Category 1: Dunya → Aqeedah (Faith & Belief)
-- - Category 3: Ākhirah → archived (category_number 5)
-- - Category 4: Fiqh → category_number 3
-- =====================================================

SET search_path TO content;

-- Step 1: Archive Ākhirah (free up category_number 3)
UPDATE content.categories
SET category_number = 5,
    title_nl = 'Ākhirah (archief)',
    title_en = 'Ākhirah (archived)'
WHERE category_number = 3;

-- Step 2: Move Fiqh from 4 to 3
UPDATE content.categories
SET category_number = 3
WHERE category_number = 4;

-- Step 3: Dunya → Aqeedah
UPDATE content.categories
SET title_nl = 'Aqeedah',
    title_en = 'Aqeedah',
    subtitle_nl = 'Geloof en overtuiging',
    subtitle_en = 'Faith & Belief',
    description_nl = 'De fundamenten van islamitisch geloof en overtuiging.',
    description_en = 'The foundations of Islamic faith and belief.'
WHERE category_number = 1;

-- Step 4: Unlink archived category from Wheel of Islam
UPDATE content.categories
SET wheel_id = NULL
WHERE category_number = 5;

-- Step 5: Update Wheel of Islam description
UPDATE content.wheels
SET description_nl = 'Aqeedah, Tazkiyyah, Fiqh – met Falah in het centrum',
    description_en = 'Aqeedah, Tazkiyyah, Fiqh – with Falah at the center'
WHERE wheel_key = 'WHEEL_OF_ISLAM';

RESET search_path;
