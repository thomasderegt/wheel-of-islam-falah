-- =====================================================
-- Flyway Migration V88: Drop domain_key from life_domains
-- =====================================================
-- Removes domain_key column; life domains identified by id only
-- =====================================================

SET search_path TO goals_okr;

-- Drop column (index idx_life_domains_key on domain_key is dropped automatically)
ALTER TABLE goals_okr.life_domains DROP COLUMN IF EXISTS domain_key;

RESET search_path;
