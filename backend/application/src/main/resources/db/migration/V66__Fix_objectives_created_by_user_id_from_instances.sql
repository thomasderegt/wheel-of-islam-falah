-- Flyway Migration V66: Fix objectives with NULL created_by_user_id
-- Custom objectives created before V65 or with bug had created_by_user_id = NULL.
-- Derive from user_objective_instances: set created_by_user_id to the instance's user_id.
-- For objectives with multiple instances (edge case), use the first one by id.

UPDATE goals_okr.objectives o
SET created_by_user_id = sub.user_id
FROM (
    SELECT DISTINCT ON (objective_id) objective_id, user_id
    FROM goals_okr.user_objective_instances
    ORDER BY objective_id, id ASC
) sub
WHERE o.id = sub.objective_id
  AND o.created_by_user_id IS NULL;
