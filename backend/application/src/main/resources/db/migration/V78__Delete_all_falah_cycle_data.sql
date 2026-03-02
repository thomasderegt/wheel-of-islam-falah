-- =====================================================
-- Flyway Migration V78: Delete all Falah cycle data
-- =====================================================
-- Removes all rows from falah_cycle table
-- =====================================================

SET search_path TO users;

TRUNCATE TABLE users.falah_cycle;

RESET search_path;
