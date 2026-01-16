-- =====================================================
-- Flyway Migration V3: Add Version Tables for Book, Chapter, Paragraph
-- =====================================================
-- Adds version tables for Book, Chapter, and Paragraph
-- Similar structure to section_versions
-- =====================================================

-- Set search path to content schema
SET search_path TO content;

-- =====================================================
-- Table: book_versions
-- Purpose: Version history for books
-- Hierarchy: Book → BookVersion
-- =====================================================
CREATE TABLE IF NOT EXISTS content.book_versions (
    id BIGSERIAL PRIMARY KEY,
    book_id BIGINT NOT NULL,
    version_number INTEGER NOT NULL,
    title_en TEXT,
    title_nl TEXT,
    intro_en TEXT,
    intro_nl TEXT,
    created_by BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_book_versions_book FOREIGN KEY (book_id) 
        REFERENCES content.books(id) ON DELETE CASCADE,
    CONSTRAINT uk_book_version UNIQUE (book_id, version_number)
);

-- Indexes for book_versions
CREATE INDEX IF NOT EXISTS idx_book_versions_book_id ON content.book_versions(book_id);
CREATE INDEX IF NOT EXISTS idx_book_versions_version_number ON content.book_versions(version_number);

-- Foreign key for working_status_bookversion_id in books table
ALTER TABLE content.books 
    ADD CONSTRAINT fk_books_working_status_version 
    FOREIGN KEY (working_status_bookversion_id) 
    REFERENCES content.book_versions(id) ON DELETE SET NULL;

-- =====================================================
-- Table: chapter_versions
-- Purpose: Version history for chapters
-- Hierarchy: Chapter → ChapterVersion
-- =====================================================
CREATE TABLE IF NOT EXISTS content.chapter_versions (
    id BIGSERIAL PRIMARY KEY,
    chapter_id BIGINT NOT NULL,
    version_number INTEGER NOT NULL,
    title_en TEXT,
    title_nl TEXT,
    intro_en TEXT,
    intro_nl TEXT,
    created_by BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_chapter_versions_chapter FOREIGN KEY (chapter_id) 
        REFERENCES content.chapters(id) ON DELETE CASCADE,
    CONSTRAINT uk_chapter_version UNIQUE (chapter_id, version_number)
);

-- Indexes for chapter_versions
CREATE INDEX IF NOT EXISTS idx_chapter_versions_chapter_id ON content.chapter_versions(chapter_id);
CREATE INDEX IF NOT EXISTS idx_chapter_versions_version_number ON content.chapter_versions(version_number);

-- Foreign key for working_status_chapterversion_id in chapters table
ALTER TABLE content.chapters 
    ADD CONSTRAINT fk_chapters_working_status_version 
    FOREIGN KEY (working_status_chapterversion_id) 
    REFERENCES content.chapter_versions(id) ON DELETE SET NULL;

-- =====================================================
-- Table: paragraph_versions
-- Purpose: Version history for paragraphs
-- Hierarchy: Paragraph → ParagraphVersion
-- =====================================================
CREATE TABLE IF NOT EXISTS content.paragraph_versions (
    id BIGSERIAL PRIMARY KEY,
    paragraph_id BIGINT NOT NULL,
    version_number INTEGER NOT NULL,
    title_en TEXT,
    title_nl TEXT,
    content_en TEXT,
    content_nl TEXT,
    created_by BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_paragraph_versions_paragraph FOREIGN KEY (paragraph_id) 
        REFERENCES content.paragraphs(id) ON DELETE CASCADE,
    CONSTRAINT uk_paragraph_version UNIQUE (paragraph_id, version_number)
);

-- Indexes for paragraph_versions
CREATE INDEX IF NOT EXISTS idx_paragraph_versions_paragraph_id ON content.paragraph_versions(paragraph_id);
CREATE INDEX IF NOT EXISTS idx_paragraph_versions_version_number ON content.paragraph_versions(version_number);

-- Foreign key for working_status_paragraphversion_id in paragraphs table
ALTER TABLE content.paragraphs 
    ADD CONSTRAINT fk_paragraphs_working_status_version 
    FOREIGN KEY (working_status_paragraphversion_id) 
    REFERENCES content.paragraph_versions(id) ON DELETE SET NULL;

-- Reset search path
RESET search_path;

