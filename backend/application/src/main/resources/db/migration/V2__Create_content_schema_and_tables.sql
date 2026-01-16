-- =====================================================
-- Flyway Migration V2: Content Module Schema and Tables
-- =====================================================
-- Creates the content schema and all content module tables
-- Schema: content
-- Hierarchy: Category → Book → Chapter → Section → Paragraph
-- Versioning: SectionVersion (v1 scope - only sections have versioning)
-- Status: ContentStatus (polymorphic status tracking)
-- =====================================================

-- Create schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS content;

-- Set search path to content schema
SET search_path TO content;

-- =====================================================
-- Table: categories
-- Purpose: Top-level content organization
-- =====================================================
CREATE TABLE IF NOT EXISTS content.categories (
    id BIGSERIAL PRIMARY KEY,
    category_number INTEGER,
    title_nl VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    description_nl TEXT,
    description_en TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for category_number lookups
CREATE INDEX IF NOT EXISTS idx_categories_category_number ON content.categories(category_number);

-- =====================================================
-- Table: books
-- Purpose: Books within categories
-- Hierarchy: Category → Book
-- =====================================================
CREATE TABLE IF NOT EXISTS content.books (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL,
    book_number INTEGER,
    working_status_bookversion_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_books_category FOREIGN KEY (category_id) 
        REFERENCES content.categories(id) ON DELETE CASCADE
);

-- Indexes for books
CREATE INDEX IF NOT EXISTS idx_books_category_id ON content.books(category_id);
CREATE INDEX IF NOT EXISTS idx_books_book_number ON content.books(book_number);

-- =====================================================
-- Table: chapters
-- Purpose: Chapters within books
-- Hierarchy: Book → Chapter
-- =====================================================
CREATE TABLE IF NOT EXISTS content.chapters (
    id BIGSERIAL PRIMARY KEY,
    book_id BIGINT NOT NULL,
    chapter_number INTEGER,
    position INTEGER NOT NULL,
    working_status_chapterversion_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_chapters_book FOREIGN KEY (book_id) 
        REFERENCES content.books(id) ON DELETE CASCADE
);

-- Indexes for chapters
CREATE INDEX IF NOT EXISTS idx_chapters_book_id ON content.chapters(book_id);
CREATE INDEX IF NOT EXISTS idx_chapters_position ON content.chapters(position);

-- =====================================================
-- Table: sections
-- Purpose: Sections within chapters
-- Hierarchy: Chapter → Section
-- =====================================================
CREATE TABLE IF NOT EXISTS content.sections (
    id BIGSERIAL PRIMARY KEY,
    chapter_id BIGINT NOT NULL,
    section_number INTEGER NOT NULL,
    working_status_sectionversion_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sections_chapter FOREIGN KEY (chapter_id) 
        REFERENCES content.chapters(id) ON DELETE CASCADE
);

-- Indexes for sections
CREATE INDEX IF NOT EXISTS idx_sections_chapter_id ON content.sections(chapter_id);
CREATE INDEX IF NOT EXISTS idx_sections_section_number ON content.sections(section_number);
CREATE INDEX IF NOT EXISTS idx_sections_working_status ON content.sections(working_status_sectionversion_id);

-- =====================================================
-- Table: section_versions
-- Purpose: Version history for sections (v1 scope - only sections)
-- Hierarchy: Section → SectionVersion
-- =====================================================
CREATE TABLE IF NOT EXISTS content.section_versions (
    id BIGSERIAL PRIMARY KEY,
    section_id BIGINT NOT NULL,
    version_number INTEGER NOT NULL,
    title_en TEXT,
    title_nl TEXT,
    intro_en TEXT,
    intro_nl TEXT,
    created_by BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_section_versions_section FOREIGN KEY (section_id) 
        REFERENCES content.sections(id) ON DELETE CASCADE,
    CONSTRAINT uk_section_version UNIQUE (section_id, version_number)
);

-- Indexes for section_versions
CREATE INDEX IF NOT EXISTS idx_section_versions_section_id ON content.section_versions(section_id);
CREATE INDEX IF NOT EXISTS idx_section_versions_version_number ON content.section_versions(version_number);

-- Foreign key for working_status_sectionversion_id in sections table
-- (Added after section_versions table exists)
ALTER TABLE content.sections 
    ADD CONSTRAINT fk_sections_working_status_version 
    FOREIGN KEY (working_status_sectionversion_id) 
    REFERENCES content.section_versions(id) ON DELETE SET NULL;

-- =====================================================
-- Table: paragraphs
-- Purpose: Paragraphs within sections
-- Hierarchy: Section → Paragraph
-- =====================================================
CREATE TABLE IF NOT EXISTS content.paragraphs (
    id BIGSERIAL PRIMARY KEY,
    section_id BIGINT NOT NULL,
    paragraph_number INTEGER NOT NULL,
    working_status_paragraphversion_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_paragraphs_section FOREIGN KEY (section_id) 
        REFERENCES content.sections(id) ON DELETE CASCADE
);

-- Indexes for paragraphs
CREATE INDEX IF NOT EXISTS idx_paragraphs_section_id ON content.paragraphs(section_id);
CREATE INDEX IF NOT EXISTS idx_paragraphs_paragraph_number ON content.paragraphs(paragraph_number);

-- =====================================================
-- Table: content_status
-- Purpose: Polymorphic status tracking (DRAFT/PUBLISHED)
-- Can reference any content entity (Category, Book, Chapter, Section, Paragraph)
-- =====================================================
CREATE TABLE IF NOT EXISTS content.content_status (
    id BIGSERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    user_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_content_status_entity UNIQUE (entity_type, entity_id)
);

-- Indexes for content_status
CREATE INDEX IF NOT EXISTS idx_content_status_entity ON content.content_status(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_content_status_status ON content.content_status(status);
CREATE INDEX IF NOT EXISTS idx_content_status_user_id ON content.content_status(user_id);

-- Reset search path
RESET search_path;

