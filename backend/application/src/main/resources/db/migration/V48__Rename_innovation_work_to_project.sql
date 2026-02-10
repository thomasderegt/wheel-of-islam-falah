-- =====================================================
-- Flyway Migration V48: Rename INNOVATION_WORK to PROJECT
-- =====================================================
-- Renames INNOVATION_WORK domain to PROJECT and updates titles/descriptions
-- =====================================================

-- Set search path to goals_okr schema
SET search_path TO goals_okr;

-- Update domain_key, titles, and descriptions
UPDATE goals_okr.life_domains 
SET 
    domain_key = 'PROJECT',
    title_nl = 'Project',
    title_en = 'Project',
    description_nl = 'Projecten beheren, doelen realiseren, resultaten behalen',
    description_en = 'Manage projects, achieve goals, deliver results',
    display_order = 1
WHERE domain_key = 'INNOVATION_WORK';

-- Reset search path
RESET search_path;
