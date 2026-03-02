-- =====================================================
-- Flyway Migration V75: Delete All Objectives and Kanban Items
-- =====================================================
-- Removes all OKR data: kanban items, user instances, templates.
-- Life domains and wheels are preserved.
-- =====================================================

SET search_path TO goals_okr;

-- 1. User data first
DELETE FROM goals_okr.kanban_items;
DELETE FROM goals_okr.key_result_progress;
DELETE FROM goals_okr.user_initiative_instances;
DELETE FROM goals_okr.user_key_result_instances;
DELETE FROM goals_okr.user_objective_instances;

-- 2. Template data (initiatives → key_results → objectives)
DELETE FROM goals_okr.initiatives;
DELETE FROM goals_okr.key_results;
DELETE FROM goals_okr.objectives;

RESET search_path;
