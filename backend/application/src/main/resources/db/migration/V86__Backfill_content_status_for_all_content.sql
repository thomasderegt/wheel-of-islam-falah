-- =====================================================
-- Flyway Migration V86: Backfill ContentStatus for all content
-- =====================================================
-- Ensures every book, chapter, section, paragraph has a ContentStatus record.
-- Creates DRAFT status for any entity that doesn't have one yet.
-- Entities that already have ContentStatus (e.g. from V9) are left unchanged.
-- =====================================================

SET search_path TO content;

-- Books without ContentStatus
INSERT INTO content.content_status (entity_type, entity_id, status, created_at, updated_at)
SELECT 'book', b.id, 'DRAFT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM content.books b
WHERE NOT EXISTS (
    SELECT 1 FROM content.content_status cs
    WHERE cs.entity_type = 'book' AND cs.entity_id = b.id
);

-- Chapters without ContentStatus
INSERT INTO content.content_status (entity_type, entity_id, status, created_at, updated_at)
SELECT 'chapter', c.id, 'DRAFT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM content.chapters c
WHERE NOT EXISTS (
    SELECT 1 FROM content.content_status cs
    WHERE cs.entity_type = 'chapter' AND cs.entity_id = c.id
);

-- Sections without ContentStatus
INSERT INTO content.content_status (entity_type, entity_id, status, created_at, updated_at)
SELECT 'section', s.id, 'DRAFT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM content.sections s
WHERE NOT EXISTS (
    SELECT 1 FROM content.content_status cs
    WHERE cs.entity_type = 'section' AND cs.entity_id = s.id
);

-- Paragraphs without ContentStatus
INSERT INTO content.content_status (entity_type, entity_id, status, created_at, updated_at)
SELECT 'paragraph', p.id, 'DRAFT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM content.paragraphs p
WHERE NOT EXISTS (
    SELECT 1 FROM content.content_status cs
    WHERE cs.entity_type = 'paragraph' AND cs.entity_id = p.id
);

RESET search_path;
