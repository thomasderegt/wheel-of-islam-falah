-- =====================================================
-- Query: Alle Goals en OKRs gegroepeerd per Life Domain
-- =====================================================
-- Toont alle goals en hun onderliggende objectives en key results
-- gegroepeerd per life domain
-- =====================================================

SELECT 
    ld.id AS life_domain_id,
    ld.domain_key,
    ld.title_nl AS life_domain_title_nl,
    ld.title_en AS life_domain_title_en,
    ld.display_order AS life_domain_order,
    g.id AS goal_id,
    g.title_nl AS goal_title_nl,
    g.title_en AS goal_title_en,
    g.description_nl AS goal_description_nl,
    g.description_en AS goal_description_en,
    g.order_index AS goal_order,
    o.id AS objective_id,
    o.title_nl AS objective_title_nl,
    o.title_en AS objective_title_en,
    o.description_nl AS objective_description_nl,
    o.description_en AS objective_description_en,
    o.order_index AS objective_order,
    kr.id AS key_result_id,
    kr.title_nl AS key_result_title_nl,
    kr.title_en AS key_result_title_en,
    kr.description_nl AS key_result_description_nl,
    kr.description_en AS key_result_description_en,
    kr.target_value AS key_result_target_value,
    kr.unit AS key_result_unit,
    kr.order_index AS key_result_order
FROM 
    goals_okr.life_domains ld
LEFT JOIN 
    goals_okr.goals g ON g.life_domain_id = ld.id
LEFT JOIN 
    goals_okr.objectives o ON o.goal_id = g.id
LEFT JOIN 
    goals_okr.key_results kr ON kr.objective_id = o.id
ORDER BY 
    ld.display_order ASC,
    g.order_index ASC,
    o.order_index ASC,
    kr.order_index ASC;

-- =====================================================
-- Alternatieve query: Compact overzicht per life domain
-- =====================================================
SELECT 
    ld.domain_key,
    ld.title_nl AS life_domain,
    COUNT(DISTINCT g.id) AS aantal_goals,
    COUNT(DISTINCT o.id) AS aantal_objectives,
    COUNT(DISTINCT kr.id) AS aantal_key_results
FROM 
    goals_okr.life_domains ld
LEFT JOIN 
    goals_okr.goals g ON g.life_domain_id = ld.id
LEFT JOIN 
    goals_okr.objectives o ON o.goal_id = g.id
LEFT JOIN 
    goals_okr.key_results kr ON kr.objective_id = o.id
GROUP BY 
    ld.id, ld.domain_key, ld.title_nl, ld.display_order
ORDER BY 
    ld.display_order ASC;
