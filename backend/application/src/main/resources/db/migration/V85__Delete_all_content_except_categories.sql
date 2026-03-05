-- =====================================================
-- Flyway Migration V85: Delete All Content Except Categories
-- =====================================================
-- Removes all books, chapters, sections, paragraphs and their versions.
-- Keeps: content.categories, content.wheels
-- Also removes: learning flows, reviews, content_status for content entities
-- =====================================================

-- Learning schema (depends on sections/paragraphs via soft refs)
DELETE FROM learning.learning_flow_step_progress;
DELETE FROM learning.learning_flow_answers;
DELETE FROM learning.learning_flow_enrollments;
DELETE FROM learning.learning_flow_steps;
DELETE FROM learning.learning_flow_templates;

-- Content review workflow
DELETE FROM content.review_comments;
DELETE FROM content.reviews;
DELETE FROM content.reviewable_items;

-- Content status for books, chapters, sections, paragraphs
DELETE FROM content.content_status
WHERE entity_type IN ('BOOK', 'CHAPTER', 'SECTION', 'PARAGRAPH');

-- Content hierarchy (bottom-up due to FKs)
DELETE FROM content.paragraph_versions;
DELETE FROM content.paragraphs;
DELETE FROM content.section_versions;
DELETE FROM content.sections;
DELETE FROM content.chapter_versions;
DELETE FROM content.chapters;
DELETE FROM content.book_versions;
DELETE FROM content.books;
