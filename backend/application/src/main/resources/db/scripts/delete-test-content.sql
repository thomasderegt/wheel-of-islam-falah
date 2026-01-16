-- =====================================================
-- Script: Delete all content with "test" in title
-- =====================================================
-- This script deletes all content items (categories, books, chapters, sections, paragraphs)
-- that have "test" (case-insensitive) in their title
-- 
-- Usage: Run this script directly against your database
-- =====================================================

-- Set search path to content schema
SET search_path TO content;

-- Show what will be deleted (for verification)
SELECT 'PARAGRAPHS to delete:' as info;
SELECT p.id, pv.title_en, pv.title_nl
FROM content.paragraphs p
JOIN content.paragraph_versions pv ON pv.paragraph_id = p.id
WHERE LOWER(COALESCE(pv.title_en, '')) LIKE '%test%'
   OR LOWER(COALESCE(pv.title_nl, '')) LIKE '%test%';

SELECT 'SECTIONS to delete:' as info;
SELECT s.id, sv.title_en, sv.title_nl
FROM content.sections s
JOIN content.section_versions sv ON sv.section_id = s.id
WHERE LOWER(COALESCE(sv.title_en, '')) LIKE '%test%'
   OR LOWER(COALESCE(sv.title_nl, '')) LIKE '%test%';

SELECT 'CHAPTERS to delete:' as info;
SELECT c.id, cv.title_en, cv.title_nl
FROM content.chapters c
JOIN content.chapter_versions cv ON cv.chapter_id = c.id
WHERE LOWER(COALESCE(cv.title_en, '')) LIKE '%test%'
   OR LOWER(COALESCE(cv.title_nl, '')) LIKE '%test%';

SELECT 'BOOKS to delete:' as info;
SELECT b.id, bv.title_en, bv.title_nl
FROM content.books b
JOIN content.book_versions bv ON bv.book_id = b.id
WHERE LOWER(COALESCE(bv.title_en, '')) LIKE '%test%'
   OR LOWER(COALESCE(bv.title_nl, '')) LIKE '%test%';

SELECT 'CATEGORIES to delete:' as info;
SELECT id, category_number, title_en, title_nl
FROM content.categories
WHERE (LOWER(COALESCE(title_en, '')) LIKE '%test%'
    OR LOWER(COALESCE(title_nl, '')) LIKE '%test%')
  AND (category_number IS NULL OR category_number >= 10);

-- =====================================================
-- ACTUAL DELETION (uncomment to execute)
-- =====================================================

BEGIN;

-- Step 1: Delete paragraphs with "test" in title
DELETE FROM content.paragraphs
WHERE id IN (
    SELECT DISTINCT pv.paragraph_id
    FROM content.paragraph_versions pv
    WHERE LOWER(COALESCE(pv.title_en, '')) LIKE '%test%'
       OR LOWER(COALESCE(pv.title_nl, '')) LIKE '%test%'
);

-- Step 2: Delete sections with "test" in title
DELETE FROM content.sections
WHERE id IN (
    SELECT DISTINCT sv.section_id
    FROM content.section_versions sv
    WHERE LOWER(COALESCE(sv.title_en, '')) LIKE '%test%'
       OR LOWER(COALESCE(sv.title_nl, '')) LIKE '%test%'
);

-- Step 3: Delete chapters with "test" in title
DELETE FROM content.chapters
WHERE id IN (
    SELECT DISTINCT cv.chapter_id
    FROM content.chapter_versions cv
    WHERE LOWER(COALESCE(cv.title_en, '')) LIKE '%test%'
       OR LOWER(COALESCE(cv.title_nl, '')) LIKE '%test%'
);

-- Step 4: Delete books with "test" in title
DELETE FROM content.books
WHERE id IN (
    SELECT DISTINCT bv.book_id
    FROM content.book_versions bv
    WHERE LOWER(COALESCE(bv.title_en, '')) LIKE '%test%'
       OR LOWER(COALESCE(bv.title_nl, '')) LIKE '%test%'
);

-- Step 5: Delete categories with "test" in title (excluding system categories)
DELETE FROM content.categories
WHERE (LOWER(COALESCE(title_en, '')) LIKE '%test%'
    OR LOWER(COALESCE(title_nl, '')) LIKE '%test%')
  AND (category_number IS NULL OR category_number >= 10);

-- Uncomment the line below to commit the deletion
-- COMMIT;

-- Or ROLLBACK to cancel
-- ROLLBACK;

-- Reset search path
RESET search_path;
