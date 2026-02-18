-- Query to determine the Goals-OKR context (LIFE/BUSINESS/WORK) for a kanban item
-- Usage: Replace :kanban_item_id with the actual id (e.g. 55)

-- Kanban item 55 context lookup
WITH kanban AS (
  SELECT id, user_id, item_type, item_id
  FROM goals_okr.kanban_items
  WHERE id = 55
),
-- Resolve life_domain_id based on item_type
goal_context AS (
  SELECT k.id, g.life_domain_id
  FROM kanban k
  JOIN goals_okr.user_goal_instances ugi ON ugi.id = k.item_id
  JOIN goals_okr.goals g ON g.id = ugi.goal_id
  WHERE k.item_type = 'GOAL'
),
objective_context AS (
  SELECT k.id, g.life_domain_id
  FROM kanban k
  JOIN goals_okr.user_objective_instances uoi ON uoi.id = k.item_id
  JOIN goals_okr.objectives o ON o.id = uoi.objective_id
  JOIN goals_okr.goals g ON g.id = o.goal_id
  WHERE k.item_type = 'OBJECTIVE'
),
key_result_context AS (
  SELECT k.id, g.life_domain_id
  FROM kanban k
  JOIN goals_okr.user_key_result_instances ukri ON ukri.id = k.item_id
  JOIN goals_okr.key_results kr ON kr.id = ukri.key_result_id
  JOIN goals_okr.objectives o ON o.id = kr.objective_id
  JOIN goals_okr.goals g ON g.id = o.goal_id
  WHERE k.item_type = 'KEY_RESULT'
),
initiative_context AS (
  SELECT k.id, g.life_domain_id
  FROM kanban k
  JOIN goals_okr.user_initiative_instances uiinst ON uiinst.id = k.item_id
  JOIN goals_okr.user_key_result_instances ukri ON ukri.id = uiinst.user_key_result_instance_id
  JOIN goals_okr.key_results kr ON kr.id = ukri.key_result_id
  JOIN goals_okr.objectives o ON o.id = kr.objective_id
  JOIN goals_okr.goals g ON g.id = o.goal_id
  WHERE k.item_type = 'INITIATIVE'
),
all_contexts AS (
  SELECT * FROM goal_context
  UNION ALL SELECT * FROM objective_context
  UNION ALL SELECT * FROM key_result_context
  UNION ALL SELECT * FROM initiative_context
)
SELECT 
  k.id AS kanban_item_id,
  k.item_type,
  k.item_id,
  ac.life_domain_id,
  ld.domain_key,
  ld.title_en AS life_domain_title,
  w.id AS wheel_id,
  w.wheel_key,
  CASE w.wheel_key
    WHEN 'WHEEL_OF_LIFE' THEN 'LIFE'
    WHEN 'WHEEL_OF_BUSINESS' THEN 'BUSINESS'
    WHEN 'WHEEL_OF_WORK' THEN 'WORK'
    ELSE 'UNKNOWN'
  END AS goals_okr_context
FROM kanban k
LEFT JOIN all_contexts ac ON ac.id = k.id
LEFT JOIN goals_okr.life_domains ld ON ld.id = ac.life_domain_id
LEFT JOIN goals_okr.wheels w ON w.id = ld.wheel_id;
