-- =====================================================
-- Flyway Migration V87: Add audio_url to review_comments
-- =====================================================
-- Allows voice recordings to be stored as comments
-- =====================================================

ALTER TABLE content.review_comments
ADD COLUMN IF NOT EXISTS audio_url VARCHAR(500);

COMMENT ON COLUMN content.review_comments.audio_url IS 'URL or path to voice recording audio file';
