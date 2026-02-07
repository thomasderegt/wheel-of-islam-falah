-- =====================================================
-- Flyway Migration V31: Seed Business Domain OKR Templates
-- =====================================================
-- Seeds OKR templates (Goals, Objectives, Key Results) for all 10 business domains
-- Structure: Business Domain → Goal → Objective → Key Result
-- Business Domains: SHARIAH, PRODUCT, SALES, MARKETING, LEAN, BUSINESS_FINANCE, 
--                   CUSTOMER_SUCCESS, TEAM, TECHNOLOGY, INNOVATION
-- =====================================================

-- Set search path to goals_okr schema
SET search_path TO goals_okr;

-- =====================================================
-- 0. SHARIAH (centraal)
-- =====================================================

-- Goal 1: "Shariah compliance waarborgen"
WITH shariah_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'SHARIAH'
),
goal_shariah_1 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'Shariah compliance waarborgen',
        'Ensure Shariah compliance',
        'Alle business activiteiten en producten voldoen aan Shariah principes en halal standaarden.',
        'All business activities and products comply with Shariah principles and halal standards.',
        1
    FROM shariah_domain
    RETURNING id
),
obj_shariah_1_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Halal certificering voor alle producten',
        'Halal certification for all products',
        NULL,
        NULL,
        1
    FROM goal_shariah_1 goal
    RETURNING id
),
obj_shariah_1_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Shariah compliance audit uitvoeren',
        'Conduct Shariah compliance audit',
        NULL,
        NULL,
        2
    FROM goal_shariah_1 goal
    RETURNING id
),
obj_shariah_1_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Compliance training voor team',
        'Compliance training for team',
        NULL,
        NULL,
        3
    FROM goal_shariah_1 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Halal certificering voor alle producten"
SELECT obj.id, '100% producten gecertificeerd', '100% products certified', NULL, NULL, 100.00, 'percentage', 1 FROM obj_shariah_1_1 obj
UNION ALL
SELECT obj.id, 'Certificering binnen 3 maanden', 'Certification within 3 months', NULL, NULL, 3.00, 'maanden', 2 FROM obj_shariah_1_1 obj
-- Key Results for Objective 2: "Shariah compliance audit uitvoeren"
UNION ALL
SELECT obj.id, 'Audit voltooid', 'Audit completed', NULL, NULL, 1.00, 'audit', 1 FROM obj_shariah_1_2 obj
UNION ALL
SELECT obj.id, '100% compliance score', '100% compliance score', NULL, NULL, 100.00, 'percentage', 2 FROM obj_shariah_1_2 obj
-- Key Results for Objective 3: "Compliance training voor team"
UNION ALL
SELECT obj.id, '100% team getraind', '100% team trained', NULL, NULL, 100.00, 'percentage', 1 FROM obj_shariah_1_3 obj
UNION ALL
SELECT obj.id, 'Training materiaal ontwikkeld', 'Training material developed', NULL, NULL, 1.00, 'materiaal', 2 FROM obj_shariah_1_3 obj;

-- Goal 2: "Zakat en charitable giving implementeren"
WITH shariah_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'SHARIAH'
),
goal_shariah_2 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'Zakat en charitable giving implementeren',
        'Implement zakat and charitable giving',
        'Zakat berekening en distributie systeem opzetten en charitable giving integreren in business model.',
        'Set up zakat calculation and distribution system and integrate charitable giving into business model.',
        2
    FROM shariah_domain
    RETURNING id
),
obj_shariah_2_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Zakat berekeningssysteem opzetten',
        'Set up zakat calculation system',
        NULL,
        NULL,
        1
    FROM goal_shariah_2 goal
    RETURNING id
),
obj_shariah_2_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Charitable partnerships opzetten',
        'Establish charitable partnerships',
        NULL,
        NULL,
        2
    FROM goal_shariah_2 goal
    RETURNING id
),
obj_shariah_2_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Transparantie in giving waarborgen',
        'Ensure transparency in giving',
        NULL,
        NULL,
        3
    FROM goal_shariah_2 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Zakat berekeningssysteem opzetten"
SELECT obj.id, 'Systeem geïmplementeerd', 'System implemented', NULL, NULL, 1.00, 'systeem', 1 FROM obj_shariah_2_1 obj
UNION ALL
SELECT obj.id, 'Zakat berekend en betaald', 'Zakat calculated and paid', NULL, NULL, 1.00, 'betaling', 2 FROM obj_shariah_2_1 obj
-- Key Results for Objective 2: "Charitable partnerships opzetten"
UNION ALL
SELECT obj.id, '3 partnerships opgezet', '3 partnerships established', NULL, NULL, 3.00, 'partnerships', 1 FROM obj_shariah_2_2 obj
UNION ALL
SELECT obj.id, '€5K+ gedoneerd', '€5K+ donated', NULL, NULL, 5000.00, 'euro', 2 FROM obj_shariah_2_2 obj
-- Key Results for Objective 3: "Transparantie in giving waarborgen"
UNION ALL
SELECT obj.id, 'Rapportage systeem live', 'Reporting system live', NULL, NULL, 1.00, 'systeem', 1 FROM obj_shariah_2_3 obj
UNION ALL
SELECT obj.id, '100% transparantie in rapporten', '100% transparency in reports', NULL, NULL, 100.00, 'percentage', 2 FROM obj_shariah_2_3 obj;

-- Goal 3: "Riba-vrije financiering en ethische business practices"
WITH shariah_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'SHARIAH'
),
goal_shariah_3 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'Riba-vrije financiering en ethische business practices',
        'Riba-free financing and ethical business practices',
        'Financiering zonder riba (rente) en ethische business practices implementeren in alle operaties.',
        'Implement financing without riba (interest) and ethical business practices in all operations.',
        3
    FROM shariah_domain
    RETURNING id
),
obj_shariah_3_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Shariah-compliant financieringsopties onderzoeken',
        'Research Shariah-compliant financing options',
        NULL,
        NULL,
        1
    FROM goal_shariah_3 goal
    RETURNING id
),
obj_shariah_3_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Ethische supply chain waarborgen',
        'Ensure ethical supply chain',
        NULL,
        NULL,
        2
    FROM goal_shariah_3 goal
    RETURNING id
),
obj_shariah_3_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Fair trade en fair wages implementeren',
        'Implement fair trade and fair wages',
        NULL,
        NULL,
        3
    FROM goal_shariah_3 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Shariah-compliant financieringsopties onderzoeken"
SELECT obj.id, '3 opties onderzocht', '3 options researched', NULL, NULL, 3.00, 'opties', 1 FROM obj_shariah_3_1 obj
UNION ALL
SELECT obj.id, 'Beste optie geselecteerd', 'Best option selected', NULL, NULL, 1.00, 'optie', 2 FROM obj_shariah_3_1 obj
-- Key Results for Objective 2: "Ethische supply chain waarborgen"
UNION ALL
SELECT obj.id, '100% leveranciers geauditeerd', '100% suppliers audited', NULL, NULL, 100.00, 'percentage', 1 FROM obj_shariah_3_2 obj
UNION ALL
SELECT obj.id, 'Code of conduct geïmplementeerd', 'Code of conduct implemented', NULL, NULL, 1.00, 'code', 2 FROM obj_shariah_3_2 obj
-- Key Results for Objective 3: "Fair trade en fair wages implementeren"
UNION ALL
SELECT obj.id, 'Fair trade certificering behaald', 'Fair trade certification obtained', NULL, NULL, 1.00, 'certificering', 1 FROM obj_shariah_3_3 obj
UNION ALL
SELECT obj.id, '100% fair wages', '100% fair wages', NULL, NULL, 100.00, 'percentage', 2 FROM obj_shariah_3_3 obj;

-- =====================================================
-- 1. PRODUCT
-- =====================================================

-- Goal 1: "Product catalogus uitbreiden en optimaliseren"
WITH product_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'PRODUCT'
),
goal_product_1 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'Product catalogus uitbreiden en optimaliseren',
        'Expand and optimize product catalog',
        'Nieuwe producten toevoegen en bestaande producten verbeteren voor betere klantwaarde.',
        'Add new products and improve existing ones for better customer value.',
        1
    FROM product_domain
    RETURNING id
),
obj_product_1_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        '10 nieuwe producten lanceren',
        'Launch 10 new products',
        NULL,
        NULL,
        1
    FROM goal_product_1 goal
    RETURNING id
),
obj_product_1_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Productbeschrijvingen optimaliseren',
        'Optimize product descriptions',
        NULL,
        NULL,
        2
    FROM goal_product_1 goal
    RETURNING id
),
obj_product_1_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Productfoto''s en video''s verbeteren',
        'Improve product photos and videos',
        NULL,
        NULL,
        3
    FROM goal_product_1 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "10 nieuwe producten lanceren"
SELECT obj.id, '10 producten gelanceerd', '10 products launched', NULL, NULL, 10.00, 'producten', 1 FROM obj_product_1_1 obj
UNION ALL
SELECT obj.id, '100% op schema', '100% on schedule', NULL, NULL, 100.00, 'percentage', 2 FROM obj_product_1_1 obj
-- Key Results for Objective 2: "Productbeschrijvingen optimaliseren"
UNION ALL
SELECT obj.id, '50 producten geoptimaliseerd', '50 products optimized', NULL, NULL, 50.00, 'producten', 1 FROM obj_product_1_2 obj
UNION ALL
SELECT obj.id, 'SEO score verbeterd met 20%', 'SEO score improved by 20%', NULL, NULL, 20.00, 'percentage', 2 FROM obj_product_1_2 obj
-- Key Results for Objective 3: "Productfoto''s en video''s verbeteren"
UNION ALL
SELECT obj.id, '30 producten met nieuwe media', '30 products with new media', NULL, NULL, 30.00, 'producten', 1 FROM obj_product_1_3 obj
UNION ALL
SELECT obj.id, 'Gemiddelde conversie +15%', 'Average conversion +15%', NULL, NULL, 15.00, 'percentage', 2 FROM obj_product_1_3 obj;

-- Goal 2: "Inventory management optimaliseren"
WITH product_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'PRODUCT'
),
goal_product_2 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'Inventory management optimaliseren',
        'Optimize inventory management',
        'Voorraadniveaus optimaliseren om stockouts te voorkomen en kosten te minimaliseren.',
        'Optimize inventory levels to prevent stockouts and minimize costs.',
        2
    FROM product_domain
    RETURNING id
),
obj_product_2_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Automatische voorraadwaarschuwingen implementeren',
        'Implement automatic inventory alerts',
        NULL,
        NULL,
        1
    FROM goal_product_2 goal
    RETURNING id
),
obj_product_2_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Voorraadrotatie verbeteren',
        'Improve inventory turnover',
        NULL,
        NULL,
        2
    FROM goal_product_2 goal
    RETURNING id
),
obj_product_2_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Stockout percentage verlagen',
        'Reduce stockout percentage',
        NULL,
        NULL,
        3
    FROM goal_product_2 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Automatische voorraadwaarschuwingen implementeren"
SELECT obj.id, 'Systeem geïmplementeerd', 'System implemented', NULL, NULL, 1.00, 'systeem', 1 FROM obj_product_2_1 obj
UNION ALL
SELECT obj.id, '100% producten gemonitord', '100% products monitored', NULL, NULL, 100.00, 'percentage', 2 FROM obj_product_2_1 obj
-- Key Results for Objective 2: "Voorraadrotatie verbeteren"
UNION ALL
SELECT obj.id, 'Rotatie verhoogd met 25%', 'Turnover increased by 25%', NULL, NULL, 25.00, 'percentage', 1 FROM obj_product_2_2 obj
UNION ALL
SELECT obj.id, 'Dead stock met 30% verlaagd', 'Dead stock reduced by 30%', NULL, NULL, 30.00, 'percentage', 2 FROM obj_product_2_2 obj
-- Key Results for Objective 3: "Stockout percentage verlagen"
UNION ALL
SELECT obj.id, 'Stockouts onder 2%', 'Stockouts below 2%', NULL, NULL, 2.00, 'percentage', 1 FROM obj_product_2_3 obj
UNION ALL
SELECT obj.id, 'Klanttevredenheid 90%+', 'Customer satisfaction 90%+', NULL, NULL, 90.00, 'percentage', 2 FROM obj_product_2_3 obj;

-- Goal 3: "Product launches succesvol uitvoeren"
WITH product_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'PRODUCT'
),
goal_product_3 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'Product launches succesvol uitvoeren',
        'Execute successful product launches',
        'Nieuwe producten succesvol lanceren met marketing en operations support.',
        'Successfully launch new products with marketing and operations support.',
        3
    FROM product_domain
    RETURNING id
),
obj_product_3_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Launch checklist voor alle producten',
        'Launch checklist for all products',
        NULL,
        NULL,
        1
    FROM goal_product_3 goal
    RETURNING id
),
obj_product_3_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Launch marketingcampagnes uitvoeren',
        'Execute launch marketing campaigns',
        NULL,
        NULL,
        2
    FROM goal_product_3 goal
    RETURNING id
),
obj_product_3_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Launch metrics tracken en analyseren',
        'Track and analyze launch metrics',
        NULL,
        NULL,
        3
    FROM goal_product_3 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Launch checklist voor alle producten"
SELECT obj.id, 'Checklist 100% compleet', 'Checklist 100% complete', NULL, NULL, 100.00, 'percentage', 1 FROM obj_product_3_1 obj
UNION ALL
SELECT obj.id, '0 vertragingen', '0 delays', NULL, NULL, 0.00, 'vertragingen', 2 FROM obj_product_3_1 obj
-- Key Results for Objective 2: "Launch marketingcampagnes uitvoeren"
UNION ALL
SELECT obj.id, '5 campagnes gelanceerd', '5 campaigns launched', NULL, NULL, 5.00, 'campagnes', 1 FROM obj_product_3_2 obj
UNION ALL
SELECT obj.id, 'Gemiddeld 1000+ bereik per campagne', 'Average 1000+ reach per campaign', NULL, NULL, 1000.00, 'bereik', 2 FROM obj_product_3_2 obj
-- Key Results for Objective 3: "Launch metrics tracken en analyseren"
UNION ALL
SELECT obj.id, 'Dashboard met real-time metrics', 'Dashboard with real-time metrics', NULL, NULL, 1.00, 'dashboard', 1 FROM obj_product_3_3 obj
UNION ALL
SELECT obj.id, 'Launch success rate 80%+', 'Launch success rate 80%+', NULL, NULL, 80.00, 'percentage', 2 FROM obj_product_3_3 obj;


-- =====================================================
-- 2. SALES
-- =====================================================

-- Goal 1: "Online sales verhogen"
WITH sales_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'SALES'
),
goal_sales_1 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'Online sales verhogen',
        'Increase online sales',
        'Revenue groei door betere sales strategieën en optimalisatie.',
        'Revenue growth through better sales strategies and optimization.',
        1
    FROM sales_domain
    RETURNING id
),
obj_sales_1_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Maandelijkse revenue met 30% verhogen',
        'Increase monthly revenue by 30%',
        NULL,
        NULL,
        1
    FROM goal_sales_1 goal
    RETURNING id
),
obj_sales_1_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Seizoensgebonden sales optimaliseren',
        'Optimize seasonal sales',
        NULL,
        NULL,
        2
    FROM goal_sales_1 goal
    RETURNING id
),
obj_sales_1_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Cross-sell en upsell verhogen',
        'Increase cross-sell and upsell',
        NULL,
        NULL,
        3
    FROM goal_sales_1 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Maandelijkse revenue met 30% verhogen"
SELECT obj.id, '€50K+ maandelijkse revenue', '€50K+ monthly revenue', NULL, NULL, 50000.00, 'euro', 1 FROM obj_sales_1_1 obj
UNION ALL
SELECT obj.id, '30% groei behaald', '30% growth achieved', NULL, NULL, 30.00, 'percentage', 2 FROM obj_sales_1_1 obj
-- Key Results for Objective 2: "Seizoensgebonden sales optimaliseren"
UNION ALL
SELECT obj.id, '4 seizoenscampagnes gelanceerd', '4 seasonal campaigns launched', NULL, NULL, 4.00, 'campagnes', 1 FROM obj_sales_1_2 obj
UNION ALL
SELECT obj.id, 'Seizoensrevenue +40%', 'Seasonal revenue +40%', NULL, NULL, 40.00, 'percentage', 2 FROM obj_sales_1_2 obj
-- Key Results for Objective 3: "Cross-sell en upsell verhogen"
UNION ALL
SELECT obj.id, 'AOV verhoogd met 20%', 'AOV increased by 20%', NULL, NULL, 20.00, 'percentage', 1 FROM obj_sales_1_3 obj
UNION ALL
SELECT obj.id, '30% van orders met add-ons', '30% of orders with add-ons', NULL, NULL, 30.00, 'percentage', 2 FROM obj_sales_1_3 obj;

-- Goal 2: "Conversion rates optimaliseren"
WITH sales_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'SALES'
),
goal_sales_2 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'Conversion rates optimaliseren',
        'Optimize conversion rates',
        'Meer bezoekers omzetten naar klanten door website en checkout optimalisatie.',
        'Convert more visitors into customers through website and checkout optimization.',
        2
    FROM sales_domain
    RETURNING id
),
obj_sales_2_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Website conversion rate verhogen',
        'Increase website conversion rate',
        NULL,
        NULL,
        1
    FROM goal_sales_2 goal
    RETURNING id
),
obj_sales_2_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Checkout abandonment verlagen',
        'Reduce checkout abandonment',
        NULL,
        NULL,
        2
    FROM goal_sales_2 goal
    RETURNING id
),
obj_sales_2_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Mobile conversion optimaliseren',
        'Optimize mobile conversion',
        NULL,
        NULL,
        3
    FROM goal_sales_2 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Website conversion rate verhogen"
SELECT obj.id, 'Conversion rate 3%+', 'Conversion rate 3%+', NULL, NULL, 3.00, 'percentage', 1 FROM obj_sales_2_1 obj
UNION ALL
SELECT obj.id, 'A/B tests uitgevoerd', 'A/B tests executed', NULL, NULL, 5.00, 'tests', 2 FROM obj_sales_2_1 obj
-- Key Results for Objective 2: "Checkout abandonment verlagen"
UNION ALL
SELECT obj.id, 'Abandonment rate onder 60%', 'Abandonment rate below 60%', NULL, NULL, 60.00, 'percentage', 1 FROM obj_sales_2_2 obj
UNION ALL
SELECT obj.id, 'Exit-int popups geïmplementeerd', 'Exit-int popups implemented', NULL, NULL, 1.00, 'feature', 2 FROM obj_sales_2_2 obj
-- Key Results for Objective 3: "Mobile conversion optimaliseren"
UNION ALL
SELECT obj.id, 'Mobile conversion 2.5%+', 'Mobile conversion 2.5%+', NULL, NULL, 2.50, 'percentage', 1 FROM obj_sales_2_3 obj
UNION ALL
SELECT obj.id, 'Mobile UX score 90+', 'Mobile UX score 90+', NULL, NULL, 90.00, 'score', 2 FROM obj_sales_2_3 obj;

-- Goal 3: "AOV (Average Order Value) verhogen"
WITH sales_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'SALES'
),
goal_sales_3 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'AOV (Average Order Value) verhogen',
        'Increase AOV (Average Order Value)',
        'Gemiddelde orderwaarde verhogen door bundels, aanbevelingen en incentives.',
        'Increase average order value through bundles, recommendations and incentives.',
        3
    FROM sales_domain
    RETURNING id
),
obj_sales_3_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Product bundels creëren',
        'Create product bundles',
        NULL,
        NULL,
        1
    FROM goal_sales_3 goal
    RETURNING id
),
obj_sales_3_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Aanbevelingsengine implementeren',
        'Implement recommendation engine',
        NULL,
        NULL,
        2
    FROM goal_sales_3 goal
    RETURNING id
),
obj_sales_3_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Minimum order incentives introduceren',
        'Introduce minimum order incentives',
        NULL,
        NULL,
        3
    FROM goal_sales_3 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Product bundels creëren"
SELECT obj.id, '10 bundels gelanceerd', '10 bundles launched', NULL, NULL, 10.00, 'bundels', 1 FROM obj_sales_3_1 obj
UNION ALL
SELECT obj.id, 'Bundel sales 15% van revenue', 'Bundle sales 15% of revenue', NULL, NULL, 15.00, 'percentage', 2 FROM obj_sales_3_1 obj
-- Key Results for Objective 2: "Aanbevelingsengine implementeren"
UNION ALL
SELECT obj.id, 'Engine geïmplementeerd', 'Engine implemented', NULL, NULL, 1.00, 'engine', 1 FROM obj_sales_3_2 obj
UNION ALL
SELECT obj.id, 'CTR op aanbevelingen 5%+', 'CTR on recommendations 5%+', NULL, NULL, 5.00, 'percentage', 2 FROM obj_sales_3_2 obj
-- Key Results for Objective 3: "Minimum order incentives introduceren"
UNION ALL
SELECT obj.id, 'Incentive programma live', 'Incentive program live', NULL, NULL, 1.00, 'programma', 1 FROM obj_sales_3_3 obj
UNION ALL
SELECT obj.id, 'AOV verhoogd met €10', 'AOV increased by €10', NULL, NULL, 10.00, 'euro', 2 FROM obj_sales_3_3 obj;


-- =====================================================
-- 3. MARKETING
-- =====================================================

-- Goal 1: "Digital marketing uitbreiden"
WITH marketing_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'MARKETING'
),
goal_marketing_1 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'Digital marketing uitbreiden',
        'Expand digital marketing',
        'Bereik en engagement vergroten via verschillende digitale kanalen.',
        'Increase reach and engagement through various digital channels.',
        1
    FROM marketing_domain
    RETURNING id
),
obj_marketing_1_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Social media presence versterken',
        'Strengthen social media presence',
        NULL,
        NULL,
        1
    FROM goal_marketing_1 goal
    RETURNING id
),
obj_marketing_1_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Email marketing optimaliseren',
        'Optimize email marketing',
        NULL,
        NULL,
        2
    FROM goal_marketing_1 goal
    RETURNING id
),
obj_marketing_1_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Paid ads campagnes uitvoeren',
        'Execute paid ads campaigns',
        NULL,
        NULL,
        3
    FROM goal_marketing_1 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Social media presence versterken"
SELECT obj.id, '10K+ volgers op Instagram', '10K+ followers on Instagram', NULL, NULL, 10000.00, 'volgers', 1 FROM obj_marketing_1_1 obj
UNION ALL
SELECT obj.id, 'Engagement rate 5%+', 'Engagement rate 5%+', NULL, NULL, 5.00, 'percentage', 2 FROM obj_marketing_1_1 obj

-- Key Results for Objective 2: "Email marketing optimaliseren"
UNION ALL
SELECT obj.id, 'Open rate 25%+', 'Open rate 25%+', NULL, NULL, 25.00, 'percentage', 1 FROM obj_marketing_1_2 obj
UNION ALL
SELECT obj.id, 'Click rate 3%+', 'Click rate 3%+', NULL, NULL, 3.00, 'percentage', 2 FROM obj_marketing_1_2 obj

-- Key Results for Objective 3: "Paid ads campagnes uitvoeren"
UNION ALL
SELECT obj.id, 'ROAS 3:1 of hoger', 'ROAS 3:1 or higher', NULL, NULL, 3.00, 'ratio', 1 FROM obj_marketing_1_3 obj
UNION ALL
SELECT obj.id, '5 campagnes gelanceerd', '5 campaigns launched', NULL, NULL, 5.00, 'campagnes', 2 FROM obj_marketing_1_3 obj;

-- Goal 2: "SEO verbeteren"
WITH marketing_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'MARKETING'
),
goal_marketing_2 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'SEO verbeteren',
        'Improve SEO',
        'Organisch verkeer verhogen door betere zoekmachine optimalisatie.',
        'Increase organic traffic through better search engine optimization.',
        2
    FROM marketing_domain
    RETURNING id
),
obj_marketing_2_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Keyword rankings verbeteren',
        'Improve keyword rankings',
        NULL,
        NULL,
        1
    FROM goal_marketing_2 goal
    RETURNING id
),
obj_marketing_2_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Content marketing uitbreiden',
        'Expand content marketing',
        NULL,
        NULL,
        2
    FROM goal_marketing_2 goal
    RETURNING id
),
obj_marketing_2_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Technical SEO optimaliseren',
        'Optimize technical SEO',
        NULL,
        NULL,
        3
    FROM goal_marketing_2 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Keyword rankings verbeteren"
SELECT obj.id, '20 keywords in top 10', '20 keywords in top 10', NULL, NULL, 20.00, 'keywords', 1 FROM obj_marketing_2_1 obj
UNION ALL
SELECT obj.id, 'Gemiddelde positie verbeterd met 5', 'Average position improved by 5', NULL, NULL, 5.00, 'posities', 2 FROM obj_marketing_2_1 obj

-- Key Results for Objective 2: "Content marketing uitbreiden"
UNION ALL
SELECT obj.id, '12 blog posts gepubliceerd', '12 blog posts published', NULL, NULL, 12.00, 'posts', 1 FROM obj_marketing_2_2 obj
UNION ALL
SELECT obj.id, 'Organisch verkeer +50%', 'Organic traffic +50%', NULL, NULL, 50.00, 'percentage', 2 FROM obj_marketing_2_2 obj

-- Key Results for Objective 3: "Technical SEO optimaliseren"
UNION ALL
SELECT obj.id, 'Page speed score 90+', 'Page speed score 90+', NULL, NULL, 90.00, 'score', 1 FROM obj_marketing_2_3 obj
UNION ALL
SELECT obj.id, 'Core Web Vitals groen', 'Core Web Vitals green', NULL, NULL, 100.00, 'percentage', 2 FROM obj_marketing_2_3 obj;

-- Goal 3: "Brand awareness verhogen"
WITH marketing_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'MARKETING'
),
goal_marketing_3 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'Brand awareness verhogen',
        'Increase brand awareness',
        'Meer mensen bereiken en merkbekendheid opbouwen.',
        'Reach more people and build brand awareness.',
        3
    FROM marketing_domain
    RETURNING id
),
obj_marketing_3_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Influencer partnerships opzetten',
        'Set up influencer partnerships',
        NULL,
        NULL,
        1
    FROM goal_marketing_3 goal
    RETURNING id
),
obj_marketing_3_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'PR en media coverage genereren',
        'Generate PR and media coverage',
        NULL,
        NULL,
        2
    FROM goal_marketing_3 goal
    RETURNING id
),
obj_marketing_3_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Community building activeren',
        'Activate community building',
        NULL,
        NULL,
        3
    FROM goal_marketing_3 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Influencer partnerships opzetten"
SELECT obj.id, '5 influencer partnerships', '5 influencer partnerships', NULL, NULL, 5.00, 'partnerships', 1 FROM obj_marketing_3_1 obj
UNION ALL
SELECT obj.id, '500K+ bereik via influencers', '500K+ reach via influencers', NULL, NULL, 500000.00, 'bereik', 2 FROM obj_marketing_3_1 obj

-- Key Results for Objective 2: "PR en media coverage genereren"
UNION ALL
SELECT obj.id, '3 media features', '3 media features', NULL, NULL, 3.00, 'features', 1 FROM obj_marketing_3_2 obj
UNION ALL
SELECT obj.id, 'Brand mentions +100%', 'Brand mentions +100%', NULL, NULL, 100.00, 'percentage', 2 FROM obj_marketing_3_2 obj

-- Key Results for Objective 3: "Community building activeren"
UNION ALL
SELECT obj.id, 'Community platform gelanceerd', 'Community platform launched', NULL, NULL, 1.00, 'platform', 1 FROM obj_marketing_3_3 obj
UNION ALL
SELECT obj.id, '1000+ actieve community members', '1000+ active community members', NULL, NULL, 1000.00, 'members', 2 FROM obj_marketing_3_3 obj;


-- =====================================================
-- 4. LEAN
-- =====================================================

-- Goal 1: "Validated learning implementeren"
WITH lean_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'LEAN'
),
goal_lean_1 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'Validated learning implementeren',
        'Implement validated learning',
        'Systematisch leren van experiments en data om betere beslissingen te nemen.',
        'Systematically learn from experiments and data to make better decisions.',
        1
    FROM lean_domain
    RETURNING id
),
obj_lean_1_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Experiment framework opzetten',
        'Set up experiment framework',
        NULL,
        NULL,
        1
    FROM goal_lean_1 goal
    RETURNING id
),
obj_lean_1_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Learning metrics definiëren',
        'Define learning metrics',
        NULL,
        NULL,
        2
    FROM goal_lean_1 goal
    RETURNING id
),
obj_lean_1_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Data-driven besluitvorming cultiveren',
        'Cultivate data-driven decision making',
        NULL,
        NULL,
        3
    FROM goal_lean_1 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Experiment framework opzetten"
SELECT obj.id, 'Framework gedocumenteerd', 'Framework documented', NULL, NULL, 1.00, 'framework', 1 FROM obj_lean_1_1 obj
UNION ALL
SELECT obj.id, '10 experiments uitgevoerd', '10 experiments executed', NULL, NULL, 10.00, 'experiments', 2 FROM obj_lean_1_1 obj

-- Key Results for Objective 2: "Learning metrics definiëren"
UNION ALL
SELECT obj.id, '5 learning metrics gedefinieerd', '5 learning metrics defined', NULL, NULL, 5.00, 'metrics', 1 FROM obj_lean_1_2 obj
UNION ALL
SELECT obj.id, 'Metrics dashboard live', 'Metrics dashboard live', NULL, NULL, 1.00, 'dashboard', 2 FROM obj_lean_1_2 obj

-- Key Results for Objective 3: "Data-driven besluitvorming cultiveren"
UNION ALL
SELECT obj.id, '80% beslissingen data-backed', '80% decisions data-backed', NULL, NULL, 80.00, 'percentage', 1 FROM obj_lean_1_3 obj
UNION ALL
SELECT obj.id, 'Weekly learning reviews', 'Weekly learning reviews', NULL, NULL, 52.00, 'reviews', 2 FROM obj_lean_1_3 obj;

-- Goal 2: "Build-Measure-Learn cycles optimaliseren"
WITH lean_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'LEAN'
),
goal_lean_2 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'Build-Measure-Learn cycles optimaliseren',
        'Optimize Build-Measure-Learn cycles',
        'Sneller itereren en leren door efficiënte feedback loops.',
        'Iterate and learn faster through efficient feedback loops.',
        2
    FROM lean_domain
    RETURNING id
),
obj_lean_2_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Cycle tijd verkorten',
        'Shorten cycle time',
        NULL,
        NULL,
        1
    FROM goal_lean_2 goal
    RETURNING id
),
obj_lean_2_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Feedback loops automatiseren',
        'Automate feedback loops',
        NULL,
        NULL,
        2
    FROM goal_lean_2 goal
    RETURNING id
),
obj_lean_2_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Experiment snelheid verhogen',
        'Increase experiment velocity',
        NULL,
        NULL,
        3
    FROM goal_lean_2 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Cycle tijd verkorten"
SELECT obj.id, 'Gemiddelde cycle tijd < 2 weken', 'Average cycle time < 2 weeks', NULL, NULL, 2.00, 'weken', 1 FROM obj_lean_2_1 obj
UNION ALL
SELECT obj.id, '50% sneller dan baseline', '50% faster than baseline', NULL, NULL, 50.00, 'percentage', 2 FROM obj_lean_2_1 obj

-- Key Results for Objective 2: "Feedback loops automatiseren"
UNION ALL
SELECT obj.id, '3 geautomatiseerde loops', '3 automated loops', NULL, NULL, 3.00, 'loops', 1 FROM obj_lean_2_2 obj
UNION ALL
SELECT obj.id, 'Real-time data beschikbaar', 'Real-time data available', NULL, NULL, 1.00, 'systeem', 2 FROM obj_lean_2_2 obj

-- Key Results for Objective 3: "Experiment snelheid verhogen"
UNION ALL
SELECT obj.id, '2 experiments per maand', '2 experiments per month', NULL, NULL, 2.00, 'experiments', 1 FROM obj_lean_2_3 obj
UNION ALL
SELECT obj.id, 'Time-to-insight < 1 week', 'Time-to-insight < 1 week', NULL, NULL, 1.00, 'week', 2 FROM obj_lean_2_3 obj;

-- Goal 3: "Metrics that matter definiëren en tracken"
WITH lean_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'LEAN'
),
goal_lean_3 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'Metrics that matter definiëren en tracken',
        'Define and track metrics that matter',
        'Focus op metrics die echt belangrijk zijn voor business success.',
        'Focus on metrics that truly matter for business success.',
        3
    FROM lean_domain
    RETURNING id
),
obj_lean_3_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'North Star Metric identificeren',
        'Identify North Star Metric',
        NULL,
        NULL,
        1
    FROM goal_lean_3 goal
    RETURNING id
),
obj_lean_3_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Leading indicators definiëren',
        'Define leading indicators',
        NULL,
        NULL,
        2
    FROM goal_lean_3 goal
    RETURNING id
),
obj_lean_3_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Vanity metrics elimineren',
        'Eliminate vanity metrics',
        NULL,
        NULL,
        3
    FROM goal_lean_3 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "North Star Metric identificeren"
SELECT obj.id, 'NSM gedefinieerd en gecommuniceerd', 'NSM defined and communicated', NULL, NULL, 1.00, 'metric', 1 FROM obj_lean_3_1 obj
UNION ALL
SELECT obj.id, 'Team alignment 100%', 'Team alignment 100%', NULL, NULL, 100.00, 'percentage', 2 FROM obj_lean_3_1 obj

-- Key Results for Objective 2: "Leading indicators definiëren"
UNION ALL
SELECT obj.id, '5 leading indicators gedefinieerd', '5 leading indicators defined', NULL, NULL, 5.00, 'indicators', 1 FROM obj_lean_3_2 obj
UNION ALL
SELECT obj.id, 'Dashboard met real-time tracking', 'Dashboard with real-time tracking', NULL, NULL, 1.00, 'dashboard', 2 FROM obj_lean_3_2 obj

-- Key Results for Objective 3: "Vanity metrics elimineren"
UNION ALL
SELECT obj.id, 'Vanity metrics verwijderd uit reports', 'Vanity metrics removed from reports', NULL, NULL, 1.00, 'cleanup', 1 FROM obj_lean_3_3 obj
UNION ALL
SELECT obj.id, 'Focus op actionable metrics 100%', 'Focus on actionable metrics 100%', NULL, NULL, 100.00, 'percentage', 2 FROM obj_lean_3_3 obj;


-- =====================================================
-- 5. BUSINESS_FINANCE
-- =====================================================

-- Goal 1: "Revenue groei realiseren"
WITH finance_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'BUSINESS_FINANCE'
),
goal_finance_1 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'Revenue groei realiseren',
        'Achieve revenue growth',
        'Consistente revenue groei realiseren door sales en marketing optimalisatie.',
        'Achieve consistent revenue growth through sales and marketing optimization.',
        1
    FROM finance_domain
    RETURNING id
),
obj_finance_1_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Maandelijkse recurring revenue verhogen',
        'Increase monthly recurring revenue',
        NULL,
        NULL,
        1
    FROM goal_finance_1 goal
    RETURNING id
),
obj_finance_1_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Nieuwe revenue streams ontwikkelen',
        'Develop new revenue streams',
        NULL,
        NULL,
        2
    FROM goal_finance_1 goal
    RETURNING id
),
obj_finance_1_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Customer lifetime value verhogen',
        'Increase customer lifetime value',
        NULL,
        NULL,
        3
    FROM goal_finance_1 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Maandelijkse recurring revenue verhogen"
SELECT obj.id, 'MRR €25K+', 'MRR €25K+', NULL, NULL, 25000.00, 'euro', 1 FROM obj_finance_1_1 obj
UNION ALL
SELECT obj.id, 'MRR groei 15%+ per maand', 'MRR growth 15%+ per month', NULL, NULL, 15.00, 'percentage', 2 FROM obj_finance_1_1 obj

-- Key Results for Objective 2: "Nieuwe revenue streams ontwikkelen"
UNION ALL
SELECT obj.id, '2 nieuwe streams gelanceerd', '2 new streams launched', NULL, NULL, 2.00, 'streams', 1 FROM obj_finance_1_2 obj
UNION ALL
SELECT obj.id, '10% van revenue uit nieuwe streams', '10% of revenue from new streams', NULL, NULL, 10.00, 'percentage', 2 FROM obj_finance_1_2 obj

-- Key Results for Objective 3: "Customer lifetime value verhogen"
UNION ALL
SELECT obj.id, 'LTV verhoogd met 25%', 'LTV increased by 25%', NULL, NULL, 25.00, 'percentage', 1 FROM obj_finance_1_3 obj
UNION ALL
SELECT obj.id, 'LTV:CAC ratio 3:1+', 'LTV:CAC ratio 3:1+', NULL, NULL, 3.00, 'ratio', 2 FROM obj_finance_1_3 obj;

-- Goal 2: "Kosten optimaliseren"
WITH finance_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'BUSINESS_FINANCE'
),
goal_finance_2 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'Kosten optimaliseren',
        'Optimize costs',
        'Operationele kosten verlagen zonder kwaliteit te compromitteren.',
        'Reduce operational costs without compromising quality.',
        2
    FROM finance_domain
    RETURNING id
),
obj_finance_2_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Supply chain kosten verlagen',
        'Reduce supply chain costs',
        NULL,
        NULL,
        1
    FROM goal_finance_2 goal
    RETURNING id
),
obj_finance_2_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Marketing efficiency verbeteren',
        'Improve marketing efficiency',
        NULL,
        NULL,
        2
    FROM goal_finance_2 goal
    RETURNING id
),
obj_finance_2_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Operational waste elimineren',
        'Eliminate operational waste',
        NULL,
        NULL,
        3
    FROM goal_finance_2 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Supply chain kosten verlagen"
SELECT obj.id, 'Kosten per order -15%', 'Cost per order -15%', NULL, NULL, 15.00, 'percentage', 1 FROM obj_finance_2_1 obj
UNION ALL
SELECT obj.id, '3 leveranciers geoptimaliseerd', '3 suppliers optimized', NULL, NULL, 3.00, 'leveranciers', 2 FROM obj_finance_2_1 obj

-- Key Results for Objective 2: "Marketing efficiency verbeteren"
UNION ALL
SELECT obj.id, 'CAC verlaagd met 20%', 'CAC reduced by 20%', NULL, NULL, 20.00, 'percentage', 1 FROM obj_finance_2_2 obj
UNION ALL
SELECT obj.id, 'ROAS verbeterd naar 4:1', 'ROAS improved to 4:1', NULL, NULL, 4.00, 'ratio', 2 FROM obj_finance_2_2 obj

-- Key Results for Objective 3: "Operational waste elimineren"
UNION ALL
SELECT obj.id, 'Waste geïdentificeerd en geëlimineerd', 'Waste identified and eliminated', NULL, NULL, 1.00, 'project', 1 FROM obj_finance_2_3 obj
UNION ALL
SELECT obj.id, 'Operationele kosten -10%', 'Operational costs -10%', NULL, NULL, 10.00, 'percentage', 2 FROM obj_finance_2_3 obj;

-- Goal 3: "Cash flow en unit economics verbeteren"
WITH finance_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'BUSINESS_FINANCE'
),
goal_finance_3 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'Cash flow en unit economics verbeteren',
        'Improve cash flow and unit economics',
        'Gezonde cash flow en winstgevende unit economics realiseren.',
        'Achieve healthy cash flow and profitable unit economics.',
        3
    FROM finance_domain
    RETURNING id
),
obj_finance_3_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Cash flow positief maken',
        'Make cash flow positive',
        NULL,
        NULL,
        1
    FROM goal_finance_3 goal
    RETURNING id
),
obj_finance_3_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Unit economics verbeteren',
        'Improve unit economics',
        NULL,
        NULL,
        2
    FROM goal_finance_3 goal
    RETURNING id
),
obj_finance_3_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Payment terms optimaliseren',
        'Optimize payment terms',
        NULL,
        NULL,
        3
    FROM goal_finance_3 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Cash flow positief maken"
SELECT obj.id, 'Positieve cash flow bereikt', 'Positive cash flow achieved', NULL, NULL, 1.00, 'milestone', 1 FROM obj_finance_3_1 obj
UNION ALL
SELECT obj.id, '3 maanden positief', '3 months positive', NULL, NULL, 3.00, 'maanden', 2 FROM obj_finance_3_1 obj

-- Key Results for Objective 2: "Unit economics verbeteren"
UNION ALL
SELECT obj.id, 'Gross margin 40%+', 'Gross margin 40%+', NULL, NULL, 40.00, 'percentage', 1 FROM obj_finance_3_2 obj
UNION ALL
SELECT obj.id, 'Contribution margin positief', 'Contribution margin positive', NULL, NULL, 1.00, 'milestone', 2 FROM obj_finance_3_2 obj

-- Key Results for Objective 3: "Payment terms optimaliseren"
UNION ALL
SELECT obj.id, 'Gemiddelde betaaltijd < 30 dagen', 'Average payment time < 30 days', NULL, NULL, 30.00, 'dagen', 1 FROM obj_finance_3_3 obj
UNION ALL
SELECT obj.id, 'Late payments < 5%', 'Late payments < 5%', NULL, NULL, 5.00, 'percentage', 2 FROM obj_finance_3_3 obj;


-- =====================================================
-- 6. CUSTOMER_SUCCESS
-- =====================================================

-- Goal 1: "Customer satisfaction verhogen"
WITH customer_success_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'CUSTOMER_SUCCESS'
),
goal_customer_success_1 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'Customer satisfaction verhogen',
        'Increase customer satisfaction',
        'Klanten tevreden houden en hun ervaring continu verbeteren.',
        'Keep customers satisfied and continuously improve their experience.',
        1
    FROM customer_success_domain
    RETURNING id
),
obj_customer_success_1_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'NPS score verhogen',
        'Increase NPS score',
        NULL,
        NULL,
        1
    FROM goal_customer_success_1 goal
    RETURNING id
),
obj_customer_success_1_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Customer reviews verbeteren',
        'Improve customer reviews',
        NULL,
        NULL,
        2
    FROM goal_customer_success_1 goal
    RETURNING id
),
obj_customer_success_1_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Support response tijd verlagen',
        'Reduce support response time',
        NULL,
        NULL,
        3
    FROM goal_customer_success_1 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "NPS score verhogen"
SELECT obj.id, 'NPS score 50+', 'NPS score 50+', NULL, NULL, 50.00, 'score', 1 FROM obj_customer_success_1_1 obj
UNION ALL
SELECT obj.id, 'NPS verbeterd met 10 punten', 'NPS improved by 10 points', NULL, NULL, 10.00, 'punten', 2 FROM obj_customer_success_1_1 obj

-- Key Results for Objective 2: "Customer reviews verbeteren"
UNION ALL
SELECT obj.id, 'Gemiddelde rating 4.5+ sterren', 'Average rating 4.5+ stars', NULL, NULL, 4.50, 'sterren', 1 FROM obj_customer_success_1_2 obj
UNION ALL
SELECT obj.id, '100+ nieuwe reviews', '100+ new reviews', NULL, NULL, 100.00, 'reviews', 2 FROM obj_customer_success_1_2 obj

-- Key Results for Objective 3: "Support response tijd verlagen"
UNION ALL
SELECT obj.id, 'Response tijd < 2 uur', 'Response time < 2 hours', NULL, NULL, 2.00, 'uren', 1 FROM obj_customer_success_1_3 obj
UNION ALL
SELECT obj.id, 'First contact resolution 80%+', 'First contact resolution 80%+', NULL, NULL, 80.00, 'percentage', 2 FROM obj_customer_success_1_3 obj;

-- Goal 2: "Customer retention verhogen"
WITH customer_success_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'CUSTOMER_SUCCESS'
),
goal_customer_success_2 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'Customer retention verhogen',
        'Increase customer retention',
        'Klanten langer behouden en herhaalaankopen stimuleren.',
        'Retain customers longer and encourage repeat purchases.',
        2
    FROM customer_success_domain
    RETURNING id
),
obj_customer_success_2_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Churn rate verlagen',
        'Reduce churn rate',
        NULL,
        NULL,
        1
    FROM goal_customer_success_2 goal
    RETURNING id
),
obj_customer_success_2_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Repeat purchase rate verhogen',
        'Increase repeat purchase rate',
        NULL,
        NULL,
        2
    FROM goal_customer_success_2 goal
    RETURNING id
),
obj_customer_success_2_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Loyalty programma implementeren',
        'Implement loyalty program',
        NULL,
        NULL,
        3
    FROM goal_customer_success_2 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Churn rate verlagen"
SELECT obj.id, 'Churn rate < 5% per maand', 'Churn rate < 5% per month', NULL, NULL, 5.00, 'percentage', 1 FROM obj_customer_success_2_1 obj
UNION ALL
SELECT obj.id, 'Churn met 30% verlaagd', 'Churn reduced by 30%', NULL, NULL, 30.00, 'percentage', 2 FROM obj_customer_success_2_1 obj

-- Key Results for Objective 2: "Repeat purchase rate verhogen"
UNION ALL
SELECT obj.id, 'Repeat rate 40%+', 'Repeat rate 40%+', NULL, NULL, 40.00, 'percentage', 1 FROM obj_customer_success_2_2 obj
UNION ALL
SELECT obj.id, 'Gemiddeld 2.5+ orders per klant', 'Average 2.5+ orders per customer', NULL, NULL, 2.50, 'orders', 2 FROM obj_customer_success_2_2 obj

-- Key Results for Objective 3: "Loyalty programma implementeren"
UNION ALL
SELECT obj.id, 'Programma gelanceerd', 'Program launched', NULL, NULL, 1.00, 'programma', 1 FROM obj_customer_success_2_3 obj
UNION ALL
SELECT obj.id, '30% van klanten actief in programma', '30% of customers active in program', NULL, NULL, 30.00, 'percentage', 2 FROM obj_customer_success_2_3 obj;

-- Goal 3: "Customer onboarding en support optimaliseren"
WITH customer_success_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'CUSTOMER_SUCCESS'
),
goal_customer_success_3 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'Customer onboarding en support optimaliseren',
        'Optimize customer onboarding and support',
        'Nieuwe klanten snel onboarden en effectieve support bieden.',
        'Quickly onboard new customers and provide effective support.',
        3
    FROM customer_success_domain
    RETURNING id
),
obj_customer_success_3_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Onboarding proces stroomlijnen',
        'Streamline onboarding process',
        NULL,
        NULL,
        1
    FROM goal_customer_success_3 goal
    RETURNING id
),
obj_customer_success_3_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Self-service support uitbreiden',
        'Expand self-service support',
        NULL,
        NULL,
        2
    FROM goal_customer_success_3 goal
    RETURNING id
),
obj_customer_success_3_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Returns proces optimaliseren',
        'Optimize returns process',
        NULL,
        NULL,
        3
    FROM goal_customer_success_3 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Onboarding proces stroomlijnen"
SELECT obj.id, 'Onboarding tijd < 5 minuten', 'Onboarding time < 5 minutes', NULL, NULL, 5.00, 'minuten', 1 FROM obj_customer_success_3_1 obj
UNION ALL
SELECT obj.id, 'Onboarding completion rate 90%+', 'Onboarding completion rate 90%+', NULL, NULL, 90.00, 'percentage', 2 FROM obj_customer_success_3_1 obj

-- Key Results for Objective 2: "Self-service support uitbreiden"
UNION ALL
SELECT obj.id, 'FAQ met 50+ artikelen', 'FAQ with 50+ articles', NULL, NULL, 50.00, 'artikelen', 1 FROM obj_customer_success_3_2 obj
UNION ALL
SELECT obj.id, '40% van vragen via self-service', '40% of questions via self-service', NULL, NULL, 40.00, 'percentage', 2 FROM obj_customer_success_3_2 obj

-- Key Results for Objective 3: "Returns proces optimaliseren"
UNION ALL
SELECT obj.id, 'Returns verwerkt binnen 3 dagen', 'Returns processed within 3 days', NULL, NULL, 3.00, 'dagen', 1 FROM obj_customer_success_3_3 obj
UNION ALL
SELECT obj.id, 'Returns rate < 5%', 'Returns rate < 5%', NULL, NULL, 5.00, 'percentage', 2 FROM obj_customer_success_3_3 obj;


-- =====================================================
-- 7. TEAM
-- =====================================================

-- Goal 1: "Team uitbreiden en ontwikkelen"
WITH team_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'TEAM'
),
goal_team_1 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'Team uitbreiden en ontwikkelen',
        'Expand and develop team',
        'Het juiste team opbouwen en teamleden helpen groeien.',
        'Build the right team and help team members grow.',
        1
    FROM team_domain
    RETURNING id
),
obj_team_1_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        '5 nieuwe teamleden aannemen',
        'Hire 5 new team members',
        NULL,
        NULL,
        1
    FROM goal_team_1 goal
    RETURNING id
),
obj_team_1_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Onboarding proces verbeteren',
        'Improve onboarding process',
        NULL,
        NULL,
        2
    FROM goal_team_1 goal
    RETURNING id
),
obj_team_1_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Development programma''s opzetten',
        'Set up development programs',
        NULL,
        NULL,
        3
    FROM goal_team_1 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "5 nieuwe teamleden aannemen"
SELECT obj.id, '5 mensen aangenomen', '5 people hired', NULL, NULL, 5.00, 'mensen', 1 FROM obj_team_1_1 obj
UNION ALL
SELECT obj.id, 'Time-to-hire < 30 dagen', 'Time-to-hire < 30 days', NULL, NULL, 30.00, 'dagen', 2 FROM obj_team_1_1 obj

-- Key Results for Objective 2: "Onboarding proces verbeteren"
UNION ALL
SELECT obj.id, 'Onboarding tijd < 1 week', 'Onboarding time < 1 week', NULL, NULL, 1.00, 'week', 1 FROM obj_team_1_2 obj
UNION ALL
SELECT obj.id, 'Nieuwe medewerker tevredenheid 90%+', 'New employee satisfaction 90%+', NULL, NULL, 90.00, 'percentage', 2 FROM obj_team_1_2 obj

-- Key Results for Objective 3: "Development programma''s opzetten"
UNION ALL
SELECT obj.id, '3 development programma''s gelanceerd', '3 development programs launched', NULL, NULL, 3.00, 'programmas', 1 FROM obj_team_1_3 obj
UNION ALL
SELECT obj.id, '80% deelname aan programma''s', '80% participation in programs', NULL, NULL, 80.00, 'percentage', 2 FROM obj_team_1_3 obj;

-- Goal 2: "Team cultuur en engagement versterken"
WITH team_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'TEAM'
),
goal_team_2 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'Team cultuur en engagement versterken',
        'Strengthen team culture and engagement',
        'Een positieve, productieve teamcultuur opbouwen.',
        'Build a positive, productive team culture.',
        2
    FROM team_domain
    RETURNING id
),
obj_team_2_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Employee engagement verhogen',
        'Increase employee engagement',
        NULL,
        NULL,
        1
    FROM goal_team_2 goal
    RETURNING id
),
obj_team_2_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Team events en activiteiten organiseren',
        'Organize team events and activities',
        NULL,
        NULL,
        2
    FROM goal_team_2 goal
    RETURNING id
),
obj_team_2_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Feedback cultuur implementeren',
        'Implement feedback culture',
        NULL,
        NULL,
        3
    FROM goal_team_2 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Employee engagement verhogen"
SELECT obj.id, 'Engagement score 80+', 'Engagement score 80+', NULL, NULL, 80.00, 'score', 1 FROM obj_team_2_1 obj
UNION ALL
SELECT obj.id, 'Employee retention 90%+', 'Employee retention 90%+', NULL, NULL, 90.00, 'percentage', 2 FROM obj_team_2_1 obj

-- Key Results for Objective 2: "Team events en activiteiten organiseren"
UNION ALL
SELECT obj.id, '12 team events per jaar', '12 team events per year', NULL, NULL, 12.00, 'events', 1 FROM obj_team_2_2 obj
UNION ALL
SELECT obj.id, '80% deelname aan events', '80% participation in events', NULL, NULL, 80.00, 'percentage', 2 FROM obj_team_2_2 obj

-- Key Results for Objective 3: "Feedback cultuur implementeren"
UNION ALL
SELECT obj.id, 'Feedback systeem geïmplementeerd', 'Feedback system implemented', NULL, NULL, 1.00, 'systeem', 1 FROM obj_team_2_3 obj
UNION ALL
SELECT obj.id, 'Monthly 1-on-1s met alle teamleden', 'Monthly 1-on-1s with all team members', NULL, NULL, 100.00, 'percentage', 2 FROM obj_team_2_3 obj;

-- Goal 3: "Performance management optimaliseren"
WITH team_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'TEAM'
),
goal_team_3 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'Performance management optimaliseren',
        'Optimize performance management',
        'Team performance meten, verbeteren en belonen.',
        'Measure, improve and reward team performance.',
        3
    FROM team_domain
    RETURNING id
),
obj_team_3_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'OKR systeem implementeren',
        'Implement OKR system',
        NULL,
        NULL,
        1
    FROM goal_team_3 goal
    RETURNING id
),
obj_team_3_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Performance reviews uitvoeren',
        'Conduct performance reviews',
        NULL,
        NULL,
        2
    FROM goal_team_3 goal
    RETURNING id
),
obj_team_3_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Recognition en rewards programma opzetten',
        'Set up recognition and rewards program',
        NULL,
        NULL,
        3
    FROM goal_team_3 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "OKR systeem implementeren"
SELECT obj.id, 'OKR systeem live voor hele team', 'OKR system live for entire team', NULL, NULL, 1.00, 'systeem', 1 FROM obj_team_3_1 obj
UNION ALL
SELECT obj.id, 'Quarterly OKR reviews', 'Quarterly OKR reviews', NULL, NULL, 4.00, 'reviews', 2 FROM obj_team_3_1 obj

-- Key Results for Objective 2: "Performance reviews uitvoeren"
UNION ALL
SELECT obj.id, '100% van team heeft review', '100% of team has review', NULL, NULL, 100.00, 'percentage', 1 FROM obj_team_3_2 obj
UNION ALL
SELECT obj.id, 'Performance goals 80%+ behaald', 'Performance goals 80%+ achieved', NULL, NULL, 80.00, 'percentage', 2 FROM obj_team_3_2 obj

-- Key Results for Objective 3: "Recognition en rewards programma opzetten"
UNION ALL
SELECT obj.id, 'Programma gelanceerd', 'Program launched', NULL, NULL, 1.00, 'programma', 1 FROM obj_team_3_3 obj
UNION ALL
SELECT obj.id, '10+ recognition momenten per kwartaal', '10+ recognition moments per quarter', NULL, NULL, 10.00, 'momenten', 2 FROM obj_team_3_3 obj;


-- =====================================================
-- 8. TECHNOLOGY
-- =====================================================

-- Goal 1: "E-commerce platform optimaliseren"
WITH technology_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'TECHNOLOGY'
),
goal_technology_1 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'E-commerce platform optimaliseren',
        'Optimize e-commerce platform',
        'Platform performance, betrouwbaarheid en gebruikerservaring verbeteren.',
        'Improve platform performance, reliability and user experience.',
        1
    FROM technology_domain
    RETURNING id
),
obj_technology_1_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Website snelheid verbeteren',
        'Improve website speed',
        NULL,
        NULL,
        1
    FROM goal_technology_1 goal
    RETURNING id
),
obj_technology_1_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Uptime en betrouwbaarheid verhogen',
        'Increase uptime and reliability',
        NULL,
        NULL,
        2
    FROM goal_technology_1 goal
    RETURNING id
),
obj_technology_1_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Mobile experience verbeteren',
        'Improve mobile experience',
        NULL,
        NULL,
        3
    FROM goal_technology_1 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Website snelheid verbeteren"
SELECT obj.id, 'Page load tijd < 2 seconden', 'Page load time < 2 seconds', NULL, NULL, 2.00, 'seconden', 1 FROM obj_technology_1_1 obj
UNION ALL
SELECT obj.id, 'Core Web Vitals score 90+', 'Core Web Vitals score 90+', NULL, NULL, 90.00, 'score', 2 FROM obj_technology_1_1 obj

-- Key Results for Objective 2: "Uptime en betrouwbaarheid verhogen"
UNION ALL
SELECT obj.id, 'Uptime 99.9%+', 'Uptime 99.9%+', NULL, NULL, 99.90, 'percentage', 1 FROM obj_technology_1_2 obj
UNION ALL
SELECT obj.id, '0 kritieke downtime incidents', '0 critical downtime incidents', NULL, NULL, 0.00, 'incidents', 2 FROM obj_technology_1_2 obj

-- Key Results for Objective 3: "Mobile experience verbeteren"
UNION ALL
SELECT obj.id, 'Mobile PageSpeed score 90+', 'Mobile PageSpeed score 90+', NULL, NULL, 90.00, 'score', 1 FROM obj_technology_1_3 obj
UNION ALL
SELECT obj.id, 'Mobile bounce rate < 40%', 'Mobile bounce rate < 40%', NULL, NULL, 40.00, 'percentage', 2 FROM obj_technology_1_3 obj;

-- Goal 2: "Integraties en automatisering uitbreiden"
WITH technology_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'TECHNOLOGY'
),
goal_technology_2 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'Integraties en automatisering uitbreiden',
        'Expand integrations and automation',
        'Workflows automatiseren en systemen integreren voor efficiëntie.',
        'Automate workflows and integrate systems for efficiency.',
        2
    FROM technology_domain
    RETURNING id
),
obj_technology_2_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'ERP integratie implementeren',
        'Implement ERP integration',
        NULL,
        NULL,
        1
    FROM goal_technology_2 goal
    RETURNING id
),
obj_technology_2_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Marketing automatisering opzetten',
        'Set up marketing automation',
        NULL,
        NULL,
        2
    FROM goal_technology_2 goal
    RETURNING id
),
obj_technology_2_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Order fulfillment automatiseren',
        'Automate order fulfillment',
        NULL,
        NULL,
        3
    FROM goal_technology_2 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "ERP integratie implementeren"
SELECT obj.id, 'ERP integratie live', 'ERP integration live', NULL, NULL, 1.00, 'integratie', 1 FROM obj_technology_2_1 obj
UNION ALL
SELECT obj.id, 'Data sync real-time', 'Data sync real-time', NULL, NULL, 1.00, 'systeem', 2 FROM obj_technology_2_1 obj

-- Key Results for Objective 2: "Marketing automatisering opzetten"
UNION ALL
SELECT obj.id, '5 geautomatiseerde workflows', '5 automated workflows', NULL, NULL, 5.00, 'workflows', 1 FROM obj_technology_2_2 obj
UNION ALL
SELECT obj.id, 'Email open rate +20%', 'Email open rate +20%', NULL, NULL, 20.00, 'percentage', 2 FROM obj_technology_2_2 obj

-- Key Results for Objective 3: "Order fulfillment automatiseren"
UNION ALL
SELECT obj.id, '80% van orders geautomatiseerd', '80% of orders automated', NULL, NULL, 80.00, 'percentage', 1 FROM obj_technology_2_3 obj
UNION ALL
SELECT obj.id, 'Fulfillment tijd -50%', 'Fulfillment time -50%', NULL, NULL, 50.00, 'percentage', 2 FROM obj_technology_2_3 obj;

-- Goal 3: "Security en compliance verbeteren"
WITH technology_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'TECHNOLOGY'
),
goal_technology_3 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'Security en compliance verbeteren',
        'Improve security and compliance',
        'Data en systemen beveiligen en compliance waarborgen.',
        'Secure data and systems and ensure compliance.',
        3
    FROM technology_domain
    RETURNING id
),
obj_technology_3_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Security audits uitvoeren',
        'Conduct security audits',
        NULL,
        NULL,
        1
    FROM goal_technology_3 goal
    RETURNING id
),
obj_technology_3_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'GDPR compliance waarborgen',
        'Ensure GDPR compliance',
        NULL,
        NULL,
        2
    FROM goal_technology_3 goal
    RETURNING id
),
obj_technology_3_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Backup en disaster recovery verbeteren',
        'Improve backup and disaster recovery',
        NULL,
        NULL,
        3
    FROM goal_technology_3 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Security audits uitvoeren"
SELECT obj.id, '2 security audits uitgevoerd', '2 security audits conducted', NULL, NULL, 2.00, 'audits', 1 FROM obj_technology_3_1 obj
UNION ALL
SELECT obj.id, 'Alle vulnerabilities opgelost', 'All vulnerabilities resolved', NULL, NULL, 100.00, 'percentage', 2 FROM obj_technology_3_1 obj

-- Key Results for Objective 2: "GDPR compliance waarborgen"
UNION ALL
SELECT obj.id, 'GDPR compliance 100%', 'GDPR compliance 100%', NULL, NULL, 100.00, 'percentage', 1 FROM obj_technology_3_2 obj
UNION ALL
SELECT obj.id, 'Privacy policy en T&Cs geüpdatet', 'Privacy policy and T&Cs updated', NULL, NULL, 1.00, 'update', 2 FROM obj_technology_3_2 obj

-- Key Results for Objective 3: "Backup en disaster recovery verbeteren"
UNION ALL
SELECT obj.id, 'Daily backups geïmplementeerd', 'Daily backups implemented', NULL, NULL, 1.00, 'systeem', 1 FROM obj_technology_3_3 obj
UNION ALL
SELECT obj.id, 'Recovery time < 4 uur', 'Recovery time < 4 hours', NULL, NULL, 4.00, 'uren', 2 FROM obj_technology_3_3 obj;


-- =====================================================
-- 9. INNOVATION
-- =====================================================

-- Goal 1: "Nieuwe productlijnen ontwikkelen"
WITH innovation_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'INNOVATION'
),
goal_innovation_1 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'Nieuwe productlijnen ontwikkelen',
        'Develop new product lines',
        'Innovatieve nieuwe producten ontwikkelen om marktpositie te versterken.',
        'Develop innovative new products to strengthen market position.',
        1
    FROM innovation_domain
    RETURNING id
),
obj_innovation_1_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        '3 nieuwe productlijnen lanceren',
        'Launch 3 new product lines',
        NULL,
        NULL,
        1
    FROM goal_innovation_1 goal
    RETURNING id
),
obj_innovation_1_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Product-market fit valideren',
        'Validate product-market fit',
        NULL,
        NULL,
        2
    FROM goal_innovation_1 goal
    RETURNING id
),
obj_innovation_1_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Innovatie pipeline opbouwen',
        'Build innovation pipeline',
        NULL,
        NULL,
        3
    FROM goal_innovation_1 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "3 nieuwe productlijnen lanceren"
SELECT obj.id, '3 productlijnen gelanceerd', '3 product lines launched', NULL, NULL, 3.00, 'productlijnen', 1 FROM obj_innovation_1_1 obj
UNION ALL
SELECT obj.id, '100% op schema', '100% on schedule', NULL, NULL, 100.00, 'percentage', 2 FROM obj_innovation_1_1 obj

-- Key Results for Objective 2: "Product-market fit valideren"
UNION ALL
SELECT obj.id, 'PMF score 70%+', 'PMF score 70%+', NULL, NULL, 70.00, 'percentage', 1 FROM obj_innovation_1_2 obj
UNION ALL
SELECT obj.id, '10 customer interviews uitgevoerd', '10 customer interviews conducted', NULL, NULL, 10.00, 'interviews', 2 FROM obj_innovation_1_2 obj

-- Key Results for Objective 3: "Innovatie pipeline opbouwen"
UNION ALL
SELECT obj.id, '10 ideeën in pipeline', '10 ideas in pipeline', NULL, NULL, 10.00, 'ideeën', 1 FROM obj_innovation_1_3 obj
UNION ALL
SELECT obj.id, 'Quarterly innovation reviews', 'Quarterly innovation reviews', NULL, NULL, 4.00, 'reviews', 2 FROM obj_innovation_1_3 obj;

-- Goal 2: "Experiments en market research uitvoeren"
WITH innovation_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'INNOVATION'
),
goal_innovation_2 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'Experiments en market research uitvoeren',
        'Conduct experiments and market research',
        'Nieuwe kansen identificeren en valideren door experiments en research.',
        'Identify and validate new opportunities through experiments and research.',
        2
    FROM innovation_domain
    RETURNING id
),
obj_innovation_2_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Market research uitvoeren',
        'Conduct market research',
        NULL,
        NULL,
        1
    FROM goal_innovation_2 goal
    RETURNING id
),
obj_innovation_2_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Rapid prototyping implementeren',
        'Implement rapid prototyping',
        NULL,
        NULL,
        2
    FROM goal_innovation_2 goal
    RETURNING id
),
obj_innovation_2_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'A/B testing programma opzetten',
        'Set up A/B testing program',
        NULL,
        NULL,
        3
    FROM goal_innovation_2 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Market research uitvoeren"
SELECT obj.id, '5 market studies voltooid', '5 market studies completed', NULL, NULL, 5.00, 'studies', 1 FROM obj_innovation_2_1 obj
UNION ALL
SELECT obj.id, 'Trends rapport gepubliceerd', 'Trends report published', NULL, NULL, 1.00, 'rapport', 2 FROM obj_innovation_2_1 obj

-- Key Results for Objective 2: "Rapid prototyping implementeren"
UNION ALL
SELECT obj.id, '5 prototypes ontwikkeld', '5 prototypes developed', NULL, NULL, 5.00, 'prototypes', 1 FROM obj_innovation_2_2 obj
UNION ALL
SELECT obj.id, 'Prototype-to-market tijd < 4 weken', 'Prototype-to-market time < 4 weeks', NULL, NULL, 4.00, 'weken', 2 FROM obj_innovation_2_2 obj

-- Key Results for Objective 3: "A/B testing programma opzetten"
UNION ALL
SELECT obj.id, 'Testing framework geïmplementeerd', 'Testing framework implemented', NULL, NULL, 1.00, 'framework', 1 FROM obj_innovation_2_3 obj
UNION ALL
SELECT obj.id, '10 A/B tests uitgevoerd', '10 A/B tests executed', NULL, NULL, 10.00, 'tests', 2 FROM obj_innovation_2_3 obj;

-- Goal 3: "Innovatie cultuur ontwikkelen"
WITH innovation_domain AS (
    SELECT id FROM goals_okr.life_domains WHERE domain_key = 'INNOVATION'
),
goal_innovation_3 AS (
    INSERT INTO goals_okr.goals (life_domain_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT id, 
        'Innovatie cultuur ontwikkelen',
        'Develop innovation culture',
        'Een cultuur creëren waarin innovatie wordt aangemoedigd en beloond.',
        'Create a culture where innovation is encouraged and rewarded.',
        3
    FROM innovation_domain
    RETURNING id
),
obj_innovation_3_1 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Innovatie workshops organiseren',
        'Organize innovation workshops',
        NULL,
        NULL,
        1
    FROM goal_innovation_3 goal
    RETURNING id
),
obj_innovation_3_2 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Ideeën management systeem opzetten',
        'Set up ideas management system',
        NULL,
        NULL,
        2
    FROM goal_innovation_3 goal
    RETURNING id
),
obj_innovation_3_3 AS (
    INSERT INTO goals_okr.objectives (goal_id, title_nl, title_en, description_nl, description_en, order_index)
    SELECT goal.id, 
        'Innovatie metrics tracken',
        'Track innovation metrics',
        NULL,
        NULL,
        3
    FROM goal_innovation_3 goal
    RETURNING id
)
INSERT INTO goals_okr.key_results (objective_id, title_nl, title_en, description_nl, description_en, target_value, unit, order_index)
-- Key Results for Objective 1: "Innovatie workshops organiseren"
SELECT obj.id, '4 workshops per jaar', '4 workshops per year', NULL, NULL, 4.00, 'workshops', 1 FROM obj_innovation_3_1 obj
UNION ALL
SELECT obj.id, '80% team deelname', '80% team participation', NULL, NULL, 80.00, 'percentage', 2 FROM obj_innovation_3_1 obj

-- Key Results for Objective 2: "Ideeën management systeem opzetten"
UNION ALL
SELECT obj.id, 'Systeem geïmplementeerd', 'System implemented', NULL, NULL, 1.00, 'systeem', 1 FROM obj_innovation_3_2 obj
UNION ALL
SELECT obj.id, '50+ ideeën ingediend', '50+ ideas submitted', NULL, NULL, 50.00, 'ideeën', 2 FROM obj_innovation_3_2 obj

-- Key Results for Objective 3: "Innovatie metrics tracken"
UNION ALL
SELECT obj.id, 'Innovation dashboard live', 'Innovation dashboard live', NULL, NULL, 1.00, 'dashboard', 1 FROM obj_innovation_3_3 obj
UNION ALL
SELECT obj.id, 'Time-to-innovation < 3 maanden', 'Time-to-innovation < 3 months', NULL, NULL, 3.00, 'maanden', 2 FROM obj_innovation_3_3 obj;

-- Reset search path
RESET search_path;
