-- =====================================================
-- Flyway Migration V10: Delete all content with "test" in title
-- =====================================================
-- This script deletes all content items (categories, books, chapters, sections, paragraphs)
-- that have "test" (case-insensitive) in their title
-- =====================================================

-- Set search path to content schema
SET search_path TO content;

-- =====================================================
-- Step 1: Delete paragraphs with "test" in title
-- =====================================================
-- Delete paragraphs that have versions with "test" in title_en or title_nl
DELETE FROM content.paragraphs
WHERE id IN (
    SELECT DISTINCT pv.paragraph_id
    FROM content.paragraph_versions pv
    WHERE LOWER(COALESCE(pv.title_en, '')) LIKE '%test%'
       OR LOWER(COALESCE(pv.title_nl, '')) LIKE '%test%'
);

-- =====================================================
-- Step 2: Delete sections with "test" in title
-- =====================================================
-- Delete sections that have versions with "test" in title_en or title_nl
DELETE FROM content.sections
WHERE id IN (
    SELECT DISTINCT sv.section_id
    FROM content.section_versions sv
    WHERE LOWER(COALESCE(sv.title_en, '')) LIKE '%test%'
       OR LOWER(COALESCE(sv.title_nl, '')) LIKE '%test%'
);

-- =====================================================
-- Step 3: Delete chapters with "test" in title
-- =====================================================
-- Delete chapters that have versions with "test" in title_en or title_nl
DELETE FROM content.chapters
WHERE id IN (
    SELECT DISTINCT cv.chapter_id
    FROM content.chapter_versions cv
    WHERE LOWER(COALESCE(cv.title_en, '')) LIKE '%test%'
       OR LOWER(COALESCE(cv.title_nl, '')) LIKE '%test%'
);

-- =====================================================
-- Step 4: Delete books with "test" in title
-- =====================================================
-- Delete books that have versions with "test" in title_en or title_nl
DELETE FROM content.books
WHERE id IN (
    SELECT DISTINCT bv.book_id
    FROM content.book_versions bv
    WHERE LOWER(COALESCE(bv.title_en, '')) LIKE '%test%'
       OR LOWER(COALESCE(bv.title_nl, '')) LIKE '%test%'
);

-- =====================================================
-- Step 5: Delete categories with "test" in title
-- =====================================================
-- Delete categories that have "test" in title_en or title_nl
-- Note: Only delete if not a system category (category_number < 10 are system categories)
DELETE FROM content.categories
WHERE (LOWER(COALESCE(title_en, '')) LIKE '%test%'
    OR LOWER(COALESCE(title_nl, '')) LIKE '%test%')
  AND (category_number IS NULL OR category_number >= 10);

-- Reset search path
RESET search_path;
