-- =====================================================
-- Flyway Migration V61: Remove All User-Created OKRs and Initiatives
-- =====================================================
-- Removes all user instance data: objectives, key results, initiatives.
-- Template data (objectives, key_results, initiatives) is preserved.
-- Order respects foreign key constraints.
-- =====================================================

SET search_path TO goals_okr;

-- 1. Kanban items (references user_objective_instances, user_key_result_instances, user_initiative_instances)
DELETE FROM goals_okr.kanban_items;

-- 2. Key result progress (references user_key_result_instances)
DELETE FROM goals_okr.key_result_progress;

-- 3. User initiative instances (references user_key_result_instances)
DELETE FROM goals_okr.user_initiative_instances;

-- 4. User-created initiatives (references user_key_result_instances)
DELETE FROM goals_okr.user_initiatives;

-- 5. User key result instances (references user_objective_instances)
DELETE FROM goals_okr.user_key_result_instances;

-- 6. User objective instances
DELETE FROM goals_okr.user_objective_instances;

RESET search_path;
