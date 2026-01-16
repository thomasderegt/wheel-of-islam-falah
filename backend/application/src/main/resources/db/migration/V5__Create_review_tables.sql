-- =====================================================
-- Flyway Migration V5: Review Workflow Tables
-- =====================================================
-- Creates review workflow tables in content schema
-- Review workflow: ReviewableItem → Review → ReviewComment
-- =====================================================

-- Set search path to content schema
SET search_path TO content;

-- =====================================================
-- Table: reviewable_items
-- Purpose: Polymorphic routing table for reviewable entities
-- Links reviewable entities (Section, Paragraph, Chapter, Book) to reviews
-- =====================================================
CREATE TABLE IF NOT EXISTS content.reviewable_items (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,  -- SECTION, PARAGRAPH, CHAPTER, BOOK
    reference_id BIGINT NOT NULL,  -- ID of the reviewable entity
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_reviewable_item UNIQUE (type, reference_id)
);

-- Indexes for reviewable_items
CREATE INDEX IF NOT EXISTS idx_reviewable_items_type ON content.reviewable_items(type);
CREATE INDEX IF NOT EXISTS idx_reviewable_items_reference_id ON content.reviewable_items(reference_id);

-- =====================================================
-- Table: reviews
-- Purpose: Review records with status and metadata
-- Status: SUBMITTED → APPROVED/REJECTED
-- =====================================================
CREATE TABLE IF NOT EXISTS content.reviews (
    id BIGSERIAL PRIMARY KEY,
    reviewable_item_id BIGINT NOT NULL,
    reviewed_version_id BIGINT NOT NULL,  -- ID of the version being reviewed
    status VARCHAR(50) NOT NULL,  -- SUBMITTED, APPROVED, REJECTED
    comment TEXT,  -- General review comment
    submitted_by BIGINT NOT NULL,  -- User ID who submitted for review
    reviewed_by BIGINT,  -- User ID who approved/rejected (supervisor)
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reviews_reviewable_item FOREIGN KEY (reviewable_item_id) 
        REFERENCES content.reviewable_items(id) ON DELETE CASCADE
);

-- Indexes for reviews
CREATE INDEX IF NOT EXISTS idx_reviews_reviewable_item ON content.reviews(reviewable_item_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON content.reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewed_version ON content.reviews(reviewed_version_id);
CREATE INDEX IF NOT EXISTS idx_reviews_submitted_by ON content.reviews(submitted_by);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewed_by ON content.reviews(reviewed_by);

-- =====================================================
-- Table: review_comments
-- Purpose: Field-level comments on specific fields of a version
-- =====================================================
CREATE TABLE IF NOT EXISTS content.review_comments (
    id BIGSERIAL PRIMARY KEY,
    review_id BIGINT NOT NULL,
    field_name VARCHAR(100) NOT NULL,  -- titleNl, titleEn, contentEn, etc.
    comment_text TEXT NOT NULL,
    created_by BIGINT NOT NULL,  -- User ID who created the comment
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_comments_review FOREIGN KEY (review_id) 
        REFERENCES content.reviews(id) ON DELETE CASCADE
);

-- Indexes for review_comments
CREATE INDEX IF NOT EXISTS idx_review_comments_review ON content.review_comments(review_id);
CREATE INDEX IF NOT EXISTS idx_review_comments_created_by ON content.review_comments(created_by);

-- Reset search path
RESET search_path;

