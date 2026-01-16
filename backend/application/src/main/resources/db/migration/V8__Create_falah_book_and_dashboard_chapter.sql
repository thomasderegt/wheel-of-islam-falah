-- =====================================================
-- Flyway Migration V8: Create Falah Book and Dashboard Chapter
-- =====================================================
-- Creates the Falah Book in Category #0 and Chapter 0 (Dashboard)
-- This chapter will render the Falah Dashboard component
-- =====================================================

-- Set search path to content schema
SET search_path TO content;

-- Get Falah category ID (Category #0)
DO $$
DECLARE
    v_falah_category_id BIGINT;
    v_falah_book_id BIGINT;
    v_dashboard_chapter_id BIGINT;
    v_book_version_id BIGINT;
    v_chapter_version_id BIGINT;
BEGIN
    -- Get Falah category ID
    SELECT id INTO v_falah_category_id
    FROM content.categories
    WHERE category_number = 0;
    
    IF v_falah_category_id IS NULL THEN
        RAISE EXCEPTION 'Falah category (category_number = 0) not found. Please run V7__Add_falah_category.sql first.';
    END IF;
    
    -- Check if Falah Book already exists
    SELECT id INTO v_falah_book_id
    FROM content.books
    WHERE category_id = v_falah_category_id
    LIMIT 1;
    
    -- Create Falah Book if it doesn't exist
    IF v_falah_book_id IS NULL THEN
        INSERT INTO content.books (category_id, created_at, updated_at)
        VALUES (v_falah_category_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id INTO v_falah_book_id;
        
        -- Create BookVersion for Falah Book
        INSERT INTO content.book_versions (book_id, version_number, title_en, title_nl, intro_en, intro_nl, created_at)
        VALUES (
            v_falah_book_id,
            1,
            'Falah',
            'Falah',
            'The central place where you learn what Falah is, set goals, and track your progress.',
            'De centrale plek waar je leert wat Falah is, doelen stelt en je voortgang volgt.',
            CURRENT_TIMESTAMP
        )
        RETURNING id INTO v_book_version_id;
        
        -- Link BookVersion to Book as working status
        UPDATE content.books
        SET working_status_bookversion_id = v_book_version_id
        WHERE id = v_falah_book_id;
    END IF;
    
    -- Check if Dashboard Chapter (position = 0) already exists
    SELECT id INTO v_dashboard_chapter_id
    FROM content.chapters
    WHERE book_id = v_falah_book_id AND position = 0;
    
    -- Create Dashboard Chapter if it doesn't exist
    IF v_dashboard_chapter_id IS NULL THEN
        INSERT INTO content.chapters (book_id, position, created_at, updated_at)
        VALUES (v_falah_book_id, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id INTO v_dashboard_chapter_id;
        
        -- Create ChapterVersion for Dashboard Chapter
        INSERT INTO content.chapter_versions (chapter_id, version_number, title_en, title_nl, intro_en, intro_nl, created_at)
        VALUES (
            v_dashboard_chapter_id,
            1,
            'Dashboard',
            'Dashboard',
            'Your central dashboard to track progress across all three pillars: Dunya, Inner World, and Akhirah.',
            'Jouw centrale dashboard om voortgang te volgen over alle drie pijlers: Dunya, Innerlijke Wereld en Ākhirah.',
            CURRENT_TIMESTAMP
        )
        RETURNING id INTO v_chapter_version_id;
        
        -- Link ChapterVersion to Chapter as working status
        UPDATE content.chapters
        SET working_status_chapterversion_id = v_chapter_version_id
        WHERE id = v_dashboard_chapter_id;
    END IF;
END $$;

-- Reset search path
RESET search_path;
