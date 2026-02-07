-- =====================================================
-- Flyway Migration V32: Add Initiative Suggestions and Learning Flow Link
-- =====================================================
-- 1. Add learningFlowEnrollmentId to initiatives table (soft reference)
-- 2. Create initiative_suggestions table
-- 3. Seed initiative suggestions for "Fajr op tijd verrichten" key result
-- =====================================================

-- Set search path to goals_okr schema
SET search_path TO goals_okr;

-- =====================================================
-- Step 1: Add learningFlowEnrollmentId to initiatives table
-- =====================================================
ALTER TABLE goals_okr.initiatives
ADD COLUMN IF NOT EXISTS learning_flow_enrollment_id BIGINT;

-- Add index for queries
CREATE INDEX IF NOT EXISTS idx_initiatives_learning_flow_enrollment 
ON goals_okr.initiatives(learning_flow_enrollment_id);

COMMENT ON COLUMN goals_okr.initiatives.learning_flow_enrollment_id IS 
'Soft reference to learning.learning_flow_enrollments. Optional - links initiative to a learning flow enrollment.';

-- =====================================================
-- Step 2: Create initiative_suggestions table
-- =====================================================
CREATE TABLE IF NOT EXISTS goals_okr.initiative_suggestions (
    id BIGSERIAL PRIMARY KEY,
    key_result_id BIGINT NOT NULL, -- FK to goals_okr.key_results (template)
    title_nl VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    description_nl TEXT,
    description_en TEXT,
    learning_flow_template_id BIGINT, -- Optional: soft reference to learning.learning_flow_templates
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_suggestion_key_result FOREIGN KEY (key_result_id)
        REFERENCES goals_okr.key_results(id) ON DELETE CASCADE
);

-- Indexes for initiative_suggestions
CREATE INDEX IF NOT EXISTS idx_suggestions_key_result ON goals_okr.initiative_suggestions(key_result_id);
CREATE INDEX IF NOT EXISTS idx_suggestions_order ON goals_okr.initiative_suggestions(key_result_id, display_order);

COMMENT ON TABLE goals_okr.initiative_suggestions IS 'Suggested initiatives for key results. Users can use these as templates when creating their own initiatives.';
COMMENT ON COLUMN goals_okr.initiative_suggestions.learning_flow_template_id IS 'Optional soft reference to learning.learning_flow_templates. If set, user can start a learning flow from this suggestion.';

-- =====================================================
-- Step 3: Seed initiative suggestions for "Fajr op tijd verrichten" key result
-- =====================================================
-- Find the key result ID for "30 dagen op tijd" under "Fajr op tijd verrichten" objective
DO $$
DECLARE
    fajr_key_result_id BIGINT;
BEGIN
    -- Find key result: "30 dagen op tijd" for objective "Fajr op tijd verrichten"
    SELECT kr.id INTO fajr_key_result_id
    FROM goals_okr.key_results kr
    JOIN goals_okr.objectives o ON o.id = kr.objective_id
    WHERE kr.title_en = '30 days on time'
      AND o.title_en = 'Perform Fajr on time'
    LIMIT 1;
    
    IF fajr_key_result_id IS NULL THEN
        RAISE NOTICE 'Key result "30 days on time" not found. Skipping seed data.';
    ELSE
        -- Insert initiative suggestions
        INSERT INTO goals_okr.initiative_suggestions (key_result_id, title_nl, title_en, description_nl, description_en, learning_flow_template_id, display_order)
        VALUES 
            (fajr_key_result_id, 
             'Leer Fajr gebed flow', 
             'Learn Fajr prayer flow',
             'Start een learning flow om de Fajr gebed flow te begrijpen en te leren.',
             'Start a learning flow to understand and learn the Fajr prayer flow.',
             NULL, -- TODO: Link to actual learning flow template when available
             1),
            (fajr_key_result_id,
             'Zet ochtend alarm op',
             'Set up morning alarm',
             'Creëer een routine om op tijd wakker te worden voor Fajr gebed.',
             'Create a routine to wake up on time for Fajr prayer.',
             NULL,
             2),
            (fajr_key_result_id,
             'Sluit je aan bij ochtend gebed groep',
             'Join morning prayer group',
             'Vind een gemeenschap om samen Fajr te bidden voor accountability.',
             'Find a community to pray Fajr together for accountability.',
             NULL,
             3)
        ON CONFLICT DO NOTHING;
        
        RAISE NOTICE 'Seeded 3 initiative suggestions for key result ID: %', fajr_key_result_id;
    END IF;
END $$;

-- Reset search path
RESET search_path;
