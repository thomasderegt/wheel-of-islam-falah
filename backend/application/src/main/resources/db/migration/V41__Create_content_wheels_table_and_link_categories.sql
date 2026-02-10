-- =====================================================
-- Flyway Migration V41: Create Content Wheels Table and Link Categories
-- =====================================================
-- Creates the content.wheels table for organizing categories
-- Adds wheel_id FK to content.categories
-- Seeds WHEEL_OF_ISLAM and links existing categories
-- =====================================================

-- Set search path to content schema
SET search_path TO content;

-- =====================================================
-- Table: wheels
-- Purpose: Organize categories into wheels (e.g., Wheel of Islam)
-- =====================================================
CREATE TABLE IF NOT EXISTS content.wheels (
    id BIGSERIAL PRIMARY KEY,
    wheel_key VARCHAR(50) NOT NULL UNIQUE, -- 'WHEEL_OF_ISLAM'
    name_nl VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    description_nl TEXT,
    description_en TEXT,
    display_order INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for wheels
CREATE INDEX IF NOT EXISTS idx_wheels_key ON content.wheels(wheel_key);
CREATE INDEX IF NOT EXISTS idx_wheels_order ON content.wheels(display_order);

-- =====================================================
-- Add wheel_id column to categories table
-- =====================================================
ALTER TABLE content.categories 
    ADD COLUMN IF NOT EXISTS wheel_id BIGINT;

-- Add FK constraint (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_category_wheel' 
        AND conrelid = 'content.categories'::regclass
    ) THEN
        ALTER TABLE content.categories 
            ADD CONSTRAINT fk_category_wheel 
            FOREIGN KEY (wheel_id) 
            REFERENCES content.wheels(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Index for wheel_id lookups
CREATE INDEX IF NOT EXISTS idx_categories_wheel_id ON content.categories(wheel_id);

-- =====================================================
-- Seed WHEEL_OF_ISLAM wheel
-- =====================================================
INSERT INTO content.wheels (wheel_key, name_nl, name_en, description_nl, description_en, display_order)
VALUES 
    ('WHEEL_OF_ISLAM', 'Wheel of Islam', 'Wheel of Islam', 
     'De vier pijlers van de Islam: Fiqh, Dunya, Tazkiyyah, Akhirah', 
     'The four pillars of Islam: Fiqh, Dunya, Tazkiyyah, Akhirah', 1)
ON CONFLICT (wheel_key) DO NOTHING;

-- =====================================================
-- Link existing categories to WHEEL_OF_ISLAM
-- Categories 0-4 (Falah, Fiqh, Dunya, Tazkiyyah, Akhirah)
-- =====================================================
UPDATE content.categories 
SET wheel_id = (SELECT id FROM content.wheels WHERE wheel_key = 'WHEEL_OF_ISLAM')
WHERE category_number IN (0, 1, 2, 3, 4)
  AND wheel_id IS NULL;

COMMENT ON TABLE content.wheels IS 'Wheels for organizing categories (e.g., Wheel of Islam)';
COMMENT ON COLUMN content.categories.wheel_id IS 'Foreign key to content.wheels - groups categories into wheels';

-- Reset search path
RESET search_path;
