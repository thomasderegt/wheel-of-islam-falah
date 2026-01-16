-- =====================================================
-- Flyway Migration V9: Publish Falah Book and Chapter
-- =====================================================
-- Sets PUBLISHED status for Falah Book and Dashboard Chapter
-- This makes them visible in the public API endpoints
-- =====================================================

-- Set search path to content schema
SET search_path TO content;

-- Publish Falah Book and Dashboard Chapter
DO $$
DECLARE
    v_falah_category_id BIGINT;
    v_falah_book_id BIGINT;
    v_dashboard_chapter_id BIGINT;
BEGIN
    -- Get Falah category ID
    SELECT id INTO v_falah_category_id
    FROM content.categories
    WHERE category_number = 0;
    
    IF v_falah_category_id IS NULL THEN
        RAISE EXCEPTION 'Falah category (category_number = 0) not found. Please run V7__Add_falah_category.sql first.';
    END IF;
    
    -- Get Falah Book ID
    SELECT id INTO v_falah_book_id
    FROM content.books
    WHERE category_id = v_falah_category_id
    LIMIT 1;
    
    IF v_falah_book_id IS NULL THEN
        RAISE EXCEPTION 'Falah book not found. Please run V8__Create_falah_book_and_dashboard_chapter.sql first.';
    END IF;
    
    -- Create or update ContentStatus for Falah Book to PUBLISHED
    INSERT INTO content.content_status (entity_type, entity_id, status, created_at, updated_at)
    VALUES ('book', v_falah_book_id, 'PUBLISHED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT (entity_type, entity_id) 
    DO UPDATE SET 
        status = 'PUBLISHED',
        updated_at = CURRENT_TIMESTAMP;
    
    -- Get Dashboard Chapter ID (position = 0)
    SELECT id INTO v_dashboard_chapter_id
    FROM content.chapters
    WHERE book_id = v_falah_book_id AND position = 0;
    
    IF v_dashboard_chapter_id IS NOT NULL THEN
        -- Create or update ContentStatus for Dashboard Chapter to PUBLISHED
        INSERT INTO content.content_status (entity_type, entity_id, status, created_at, updated_at)
        VALUES ('chapter', v_dashboard_chapter_id, 'PUBLISHED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT (entity_type, entity_id) 
        DO UPDATE SET 
            status = 'PUBLISHED',
            updated_at = CURRENT_TIMESTAMP;
    END IF;
END $$;

-- Reset search path
RESET search_path;
