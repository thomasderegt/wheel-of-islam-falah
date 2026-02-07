-- =====================================================
-- Flyway Migration V12: Add subtitle fields to categories
-- =====================================================
-- Adds subtitle_nl and subtitle_en columns to categories table
-- =====================================================

-- Set search path to content schema
SET search_path TO content;

-- Add subtitle_nl column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'content' 
        AND table_name = 'categories' 
        AND column_name = 'subtitle_nl'
    ) THEN
        ALTER TABLE content.categories 
        ADD COLUMN subtitle_nl VARCHAR(255);
    END IF;
END $$;

-- Add subtitle_en column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'content' 
        AND table_name = 'categories' 
        AND column_name = 'subtitle_en'
    ) THEN
        ALTER TABLE content.categories 
        ADD COLUMN subtitle_en VARCHAR(255);
    END IF;
END $$;

-- Reset search path
RESET search_path;
