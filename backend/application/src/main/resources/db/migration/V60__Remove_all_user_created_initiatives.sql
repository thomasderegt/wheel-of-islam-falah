-- =====================================================
-- Flyway Migration V60: Remove All User-Created Initiatives
-- =====================================================
-- Removes all initiatives created by users (user_initiatives)
-- and their instances. Template initiatives (goals_okr.initiatives)
-- and instances based on templates are preserved.
-- =====================================================

SET search_path TO goals_okr;

-- 1. Remove kanban items that reference user initiative instances (user-created)
DELETE FROM goals_okr.kanban_items
WHERE item_type = 'INITIATIVE'
  AND item_id IN (
    SELECT uiinst.id
    FROM goals_okr.user_initiative_instances uiinst
    INNER JOIN goals_okr.user_initiatives ui ON ui.id = uiinst.initiative_id
  );

-- 2. Remove user initiative instances that reference user-created initiatives
DELETE FROM goals_okr.user_initiative_instances
WHERE initiative_id IN (SELECT id FROM goals_okr.user_initiatives);

-- 3. Remove all user-created initiatives
DELETE FROM goals_okr.user_initiatives;

RESET search_path;
