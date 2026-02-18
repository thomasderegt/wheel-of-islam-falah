-- =====================================================
-- Flyway Migration V56: Clear All Goals and OKR Data
-- =====================================================
-- Removes all goals/OKR template and user instance data
-- so the structure can be changed (e.g. goal layer removed,
-- timeframe label on objectives). Wheels and life domains
-- are preserved.
-- Only deletes from tables that exist (safe across DB states).
-- =====================================================

SET search_path TO goals_okr;

-- Child tables first (respecting foreign keys). Use conditional deletes
-- so migration succeeds even if some tables were never created.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'goals_okr' AND table_name = 'key_result_progress') THEN
    DELETE FROM goals_okr.key_result_progress;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'goals_okr' AND table_name = 'initiative_suggestions') THEN
    DELETE FROM goals_okr.initiative_suggestions;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'goals_okr' AND table_name = 'user_initiative_instances') THEN
    DELETE FROM goals_okr.user_initiative_instances;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'goals_okr' AND table_name = 'user_initiatives') THEN
    DELETE FROM goals_okr.user_initiatives;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'goals_okr' AND table_name = 'initiatives') THEN
    DELETE FROM goals_okr.initiatives;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'goals_okr' AND table_name = 'user_key_result_instances') THEN
    DELETE FROM goals_okr.user_key_result_instances;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'goals_okr' AND table_name = 'kanban_items') THEN
    DELETE FROM goals_okr.kanban_items;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'goals_okr' AND table_name = 'user_objective_instances') THEN
    DELETE FROM goals_okr.user_objective_instances;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'goals_okr' AND table_name = 'user_goal_instances') THEN
    DELETE FROM goals_okr.user_goal_instances;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'goals_okr' AND table_name = 'key_results') THEN
    DELETE FROM goals_okr.key_results;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'goals_okr' AND table_name = 'objectives') THEN
    DELETE FROM goals_okr.objectives;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'goals_okr' AND table_name = 'goals') THEN
    DELETE FROM goals_okr.goals;
  END IF;
END $$;

RESET search_path;
