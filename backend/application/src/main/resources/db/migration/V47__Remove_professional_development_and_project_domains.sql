-- =====================================================
-- Flyway Migration V47: Remove PROFESSIONAL_DEVELOPMENT and PROJECT domains
-- =====================================================
-- Removes PROFESSIONAL_DEVELOPMENT and PROJECT domains that were added
-- but are no longer in the enum after rollback
-- =====================================================

-- Set search path to goals_okr schema
SET search_path TO goals_okr;

-- Remove PROFESSIONAL_DEVELOPMENT and PROJECT domains if they exist
-- Note: We use DELETE instead of hiding because these domains should not exist
-- and would cause enum parsing errors
DELETE FROM goals_okr.life_domains 
WHERE domain_key IN ('PROFESSIONAL_DEVELOPMENT', 'PROJECT');

-- Reset search path
RESET search_path;
