-- =====================================================
-- Script: Swap positions of "Doelen" and "Succes" chapters
-- =====================================================
-- This script swaps the positions of chapters with titles "Doelen" and "Succes"
-- in the Falah book (Category #0)
-- =====================================================

-- Set search path to content schema
SET search_path TO content;

-- Show current state (for verification)
SELECT 'Current chapters with Doelen or Succes:' as info;
SELECT 
    c.id,
    c.position,
    cv.title_nl,
    cv.title_en,
    b.id as book_id
FROM content.chapters c
JOIN content.chapter_versions cv ON cv.chapter_id = c.id
JOIN content.books b ON b.id = c.book_id
JOIN content.categories cat ON cat.id = b.category_id
WHERE cat.category_number = 0
  AND (LOWER(COALESCE(cv.title_nl, '')) LIKE '%doelen%'
       OR LOWER(COALESCE(cv.title_en, '')) LIKE '%doelen%'
       OR LOWER(COALESCE(cv.title_nl, '')) LIKE '%succes%'
       OR LOWER(COALESCE(cv.title_en, '')) LIKE '%succes%')
ORDER BY c.position;

-- =====================================================
-- ACTUAL SWAP (uncomment to execute)
-- =====================================================

BEGIN;

-- Get the positions of Doelen and Succes chapters
DO $$
DECLARE
    v_doelen_chapter_id BIGINT;
    v_succes_chapter_id BIGINT;
    v_doelen_position INTEGER;
    v_succes_position INTEGER;
    v_falah_book_id BIGINT;
BEGIN
    -- Get Falah book ID
    SELECT id INTO v_falah_book_id
    FROM content.books
    WHERE category_id = (
        SELECT id FROM content.categories WHERE category_number = 0
    )
    LIMIT 1;
    
    IF v_falah_book_id IS NULL THEN
        RAISE EXCEPTION 'Falah book not found';
    END IF;
    
    -- Find Doelen chapter
    SELECT c.id, c.position INTO v_doelen_chapter_id, v_doelen_position
    FROM content.chapters c
    JOIN content.chapter_versions cv ON cv.chapter_id = c.id
    WHERE c.book_id = v_falah_book_id
      AND (LOWER(COALESCE(cv.title_nl, '')) LIKE '%doelen%'
           OR LOWER(COALESCE(cv.title_en, '')) LIKE '%doelen%')
    LIMIT 1;
    
    -- Find Succes chapter
    SELECT c.id, c.position INTO v_succes_chapter_id, v_succes_position
    FROM content.chapters c
    JOIN content.chapter_versions cv ON cv.chapter_id = c.id
    WHERE c.book_id = v_falah_book_id
      AND (LOWER(COALESCE(cv.title_nl, '')) LIKE '%succes%'
           OR LOWER(COALESCE(cv.title_en, '')) LIKE '%succes%')
    LIMIT 1;
    
    -- Check if both chapters were found
    IF v_doelen_chapter_id IS NULL THEN
        RAISE EXCEPTION 'Doelen chapter not found';
    END IF;
    
    IF v_succes_chapter_id IS NULL THEN
        RAISE EXCEPTION 'Succes chapter not found';
    END IF;
    
    -- Swap positions using temporary value
    -- First, set Doelen to a temporary position (use 99 as temp)
    UPDATE content.chapters
    SET position = 99, updated_at = CURRENT_TIMESTAMP
    WHERE id = v_doelen_chapter_id;
    
    -- Then, set Succes to Doelen's original position
    UPDATE content.chapters
    SET position = v_doelen_position, updated_at = CURRENT_TIMESTAMP
    WHERE id = v_succes_chapter_id;
    
    -- Finally, set Doelen to Succes's original position
    UPDATE content.chapters
    SET position = v_succes_position, updated_at = CURRENT_TIMESTAMP
    WHERE id = v_doelen_chapter_id;
    
    RAISE NOTICE 'Swapped positions: Doelen (was %, now %) and Succes (was %, now %)', 
        v_doelen_position, v_succes_position, v_succes_position, v_doelen_position;
END $$;

-- Uncomment the line below to commit the swap
-- COMMIT;

-- Or ROLLBACK to cancel
-- ROLLBACK;

-- Reset search path
RESET search_path;
