-- =====================================================
-- Flyway Migration V11: Add fields to review_comments
-- =====================================================
-- Adds reviewed_version_id and updated_at fields to review_comments table
-- =====================================================

-- Set search path to content schema
SET search_path TO content;

-- Add reviewed_version_id column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'content' 
        AND table_name = 'review_comments' 
        AND column_name = 'reviewed_version_id'
    ) THEN
        ALTER TABLE content.review_comments 
        ADD COLUMN reviewed_version_id BIGINT;
        
        -- Update existing rows (set to reviewed_version_id from parent review)
        UPDATE content.review_comments rc
        SET reviewed_version_id = r.reviewed_version_id
        FROM content.reviews r
        WHERE rc.review_id = r.id
        AND rc.reviewed_version_id IS NULL;
        
        -- Make it NOT NULL after updating existing data
        ALTER TABLE content.review_comments 
        ALTER COLUMN reviewed_version_id SET NOT NULL;
    END IF;
END $$;

-- Add updated_at column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'content' 
        AND table_name = 'review_comments' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE content.review_comments 
        ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
        
        -- Set updated_at to created_at for existing rows
        UPDATE content.review_comments 
        SET updated_at = created_at 
        WHERE updated_at IS NULL;
    END IF;
END $$;

-- Add index for reviewed_version_id if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_review_comments_version 
ON content.review_comments(reviewed_version_id);

-- Add index for review_id and field_name combination if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_review_comments_field 
ON content.review_comments(review_id, field_name);

-- Reset search path
RESET search_path;
