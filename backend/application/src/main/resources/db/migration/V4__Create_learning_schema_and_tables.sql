-- =====================================================
-- Flyway Migration V4: Learning Module Schema and Tables
-- =====================================================
-- Creates the learning schema and all learning module tables
-- Schema: learning
-- Purpose: Learning flows, templates, enrollments, answers, and progress
-- =====================================================

-- Create schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS learning;

-- Set search path to learning schema
SET search_path TO learning;

-- =====================================================
-- Table: learning_flow_templates
-- Purpose: Admin-designed learning flow templates for sections
-- =====================================================
CREATE TABLE IF NOT EXISTS learning.learning_flow_templates (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    section_id BIGINT NOT NULL, -- Soft reference to content.sections (no FK)
    created_by BIGINT NOT NULL, -- Soft reference to users.users (no FK)
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for learning_flow_templates
CREATE INDEX IF NOT EXISTS idx_templates_section ON learning.learning_flow_templates(section_id);
CREATE INDEX IF NOT EXISTS idx_templates_created_by ON learning.learning_flow_templates(created_by);

-- =====================================================
-- Table: learning_flow_steps
-- Purpose: Steps within a template (reflectie questions per paragraph)
-- =====================================================
CREATE TABLE IF NOT EXISTS learning.learning_flow_steps (
    id BIGSERIAL PRIMARY KEY,
    template_id BIGINT NOT NULL,
    paragraph_id BIGINT NOT NULL, -- Soft reference to content.paragraphs (no FK)
    order_index INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    CONSTRAINT fk_step_template FOREIGN KEY (template_id) 
        REFERENCES learning.learning_flow_templates(id) ON DELETE CASCADE,
    CONSTRAINT uk_template_order UNIQUE (template_id, order_index)
);

-- Indexes for learning_flow_steps
CREATE INDEX IF NOT EXISTS idx_steps_template ON learning.learning_flow_steps(template_id);
CREATE INDEX IF NOT EXISTS idx_steps_paragraph ON learning.learning_flow_steps(paragraph_id);

-- =====================================================
-- Table: learning_flow_enrollments
-- Purpose: User-specific instances of learning flows
-- =====================================================
CREATE TABLE IF NOT EXISTS learning.learning_flow_enrollments (
    id BIGSERIAL PRIMARY KEY,
    template_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL, -- Soft reference to users.users (no FK)
    section_id BIGINT NOT NULL, -- Soft reference to content.sections (no FK)
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    CONSTRAINT fk_enrollment_template FOREIGN KEY (template_id) 
        REFERENCES learning.learning_flow_templates(id)
);

-- Indexes for learning_flow_enrollments
CREATE INDEX IF NOT EXISTS idx_enrollments_template ON learning.learning_flow_enrollments(template_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON learning.learning_flow_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_section ON learning.learning_flow_enrollments(section_id);

-- =====================================================
-- Table: learning_flow_answers
-- Purpose: User answers to learning flow steps
-- =====================================================
CREATE TABLE IF NOT EXISTS learning.learning_flow_answers (
    id BIGSERIAL PRIMARY KEY,
    enrollment_id BIGINT NOT NULL,
    step_id BIGINT NOT NULL,
    answer_type VARCHAR(50) NOT NULL, -- PICTURE_QUESTION or REFLECTION
    answer_text TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_answer_enrollment FOREIGN KEY (enrollment_id) 
        REFERENCES learning.learning_flow_enrollments(id) ON DELETE CASCADE,
    CONSTRAINT fk_answer_step FOREIGN KEY (step_id) 
        REFERENCES learning.learning_flow_steps(id)
);

-- Indexes for learning_flow_answers
CREATE INDEX IF NOT EXISTS idx_answers_enrollment ON learning.learning_flow_answers(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_answers_step ON learning.learning_flow_answers(step_id);

-- =====================================================
-- Table: learning_flow_step_progress
-- Purpose: Progress tracking per step per enrollment
-- =====================================================
CREATE TABLE IF NOT EXISTS learning.learning_flow_step_progress (
    id BIGSERIAL PRIMARY KEY,
    enrollment_id BIGINT NOT NULL,
    step_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL, -- NOT_STARTED, IN_PROGRESS, COMPLETED
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_progress_enrollment FOREIGN KEY (enrollment_id) 
        REFERENCES learning.learning_flow_enrollments(id) ON DELETE CASCADE,
    CONSTRAINT fk_progress_step FOREIGN KEY (step_id) 
        REFERENCES learning.learning_flow_steps(id),
    CONSTRAINT uk_enrollment_step UNIQUE (enrollment_id, step_id)
);

-- Indexes for learning_flow_step_progress
CREATE INDEX IF NOT EXISTS idx_progress_enrollment ON learning.learning_flow_step_progress(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_progress_step ON learning.learning_flow_step_progress(step_id);

