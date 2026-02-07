-- =====================================================
-- Flyway Migration V30: Seed Business Domains
-- =====================================================
-- Seeds business domains for Wheel of Business
-- =====================================================

-- Set search path to goals_okr schema
SET search_path TO goals_okr;

-- Get Wheel of Business ID
DO $$
DECLARE
    wheel_of_business_id BIGINT;
BEGIN
    SELECT id INTO wheel_of_business_id FROM goals_okr.wheels WHERE wheel_key = 'WHEEL_OF_BUSINESS';
    
    IF wheel_of_business_id IS NULL THEN
        RAISE EXCEPTION 'Wheel of Business not found';
    END IF;

    -- Seed business domains (only if they don't exist)
    -- SHARIAH (centraal - displayOrder 0)
    INSERT INTO goals_okr.life_domains (domain_key, title_nl, title_en, description_nl, description_en, icon_name, display_order, wheel_id)
    VALUES 
        ('SHARIAH', 'Ethics / Shariah', 'Ethics / Shariah', 
         'Shariah compliance, halal verificatie, zakat, riba-vrije financiering, ethische business practices', 
         'Shariah compliance, halal verification, zakat, riba-free financing, ethical business practices',
         'shield-check', 0, wheel_of_business_id)
    ON CONFLICT (domain_key) DO UPDATE SET
        wheel_id = EXCLUDED.wheel_id,
        title_nl = EXCLUDED.title_nl,
        title_en = EXCLUDED.title_en,
        description_nl = EXCLUDED.description_nl,
        description_en = EXCLUDED.description_en,
        display_order = EXCLUDED.display_order;

    INSERT INTO goals_okr.life_domains (domain_key, title_nl, title_en, description_nl, description_en, icon_name, display_order, wheel_id)
    VALUES 
        ('PRODUCT', 'Product', 'Product', 
         'Productontwikkeling, features, roadmap, user experience', 
         'Product development, features, roadmap, user experience',
         'package', 1, wheel_of_business_id)
    ON CONFLICT (domain_key) DO UPDATE SET
        wheel_id = EXCLUDED.wheel_id,
        title_nl = EXCLUDED.title_nl,
        title_en = EXCLUDED.title_en,
        description_nl = EXCLUDED.description_nl,
        description_en = EXCLUDED.description_en,
        display_order = EXCLUDED.display_order;

    INSERT INTO goals_okr.life_domains (domain_key, title_nl, title_en, description_nl, description_en, icon_name, display_order, wheel_id)
    VALUES 
        ('SALES', 'Sales', 'Sales', 
         'Verkoop, revenue, klantenwerving, deals', 
         'Sales, revenue, customer acquisition, deals',
         'trending-up', 2, wheel_of_business_id)
    ON CONFLICT (domain_key) DO UPDATE SET
        wheel_id = EXCLUDED.wheel_id,
        title_nl = EXCLUDED.title_nl,
        title_en = EXCLUDED.title_en,
        description_nl = EXCLUDED.description_nl,
        description_en = EXCLUDED.description_en,
        display_order = EXCLUDED.display_order;

    INSERT INTO goals_okr.life_domains (domain_key, title_nl, title_en, description_nl, description_en, icon_name, display_order, wheel_id)
    VALUES 
        ('MARKETING', 'Marketing', 'Marketing', 
         'Brand awareness, lead generation, content, campaigns', 
         'Brand awareness, lead generation, content, campaigns',
         'megaphone', 3, wheel_of_business_id)
    ON CONFLICT (domain_key) DO UPDATE SET
        wheel_id = EXCLUDED.wheel_id,
        title_nl = EXCLUDED.title_nl,
        title_en = EXCLUDED.title_en,
        description_nl = EXCLUDED.description_nl,
        description_en = EXCLUDED.description_en,
        display_order = EXCLUDED.display_order;

    INSERT INTO goals_okr.life_domains (domain_key, title_nl, title_en, description_nl, description_en, icon_name, display_order, wheel_id)
    VALUES 
        ('LEAN', 'Lean Startup', 'Lean Startup', 
         'Lean Startup methodologie, validated learning, experiments, build-measure-learn cycles, metrics that matter', 
         'Lean Startup methodology, validated learning, experiments, build-measure-learn cycles, metrics that matter',
         'zap', 4, wheel_of_business_id)
    ON CONFLICT (domain_key) DO UPDATE SET
        wheel_id = EXCLUDED.wheel_id,
        title_nl = EXCLUDED.title_nl,
        title_en = EXCLUDED.title_en,
        description_nl = EXCLUDED.description_nl,
        description_en = EXCLUDED.description_en,
        display_order = EXCLUDED.display_order;

    INSERT INTO goals_okr.life_domains (domain_key, title_nl, title_en, description_nl, description_en, icon_name, display_order, wheel_id)
    VALUES 
        ('BUSINESS_FINANCE', 'Finance', 'Finance', 
         'Revenue, costs, profitability, cash flow, financial health', 
         'Revenue, costs, profitability, cash flow, financial health',
         'dollar-sign', 5, wheel_of_business_id)
    ON CONFLICT (domain_key) DO UPDATE SET
        wheel_id = EXCLUDED.wheel_id,
        title_nl = EXCLUDED.title_nl,
        title_en = EXCLUDED.title_en,
        description_nl = EXCLUDED.description_nl,
        description_en = EXCLUDED.description_en,
        display_order = EXCLUDED.display_order;

    INSERT INTO goals_okr.life_domains (domain_key, title_nl, title_en, description_nl, description_en, icon_name, display_order, wheel_id)
    VALUES 
        ('CUSTOMER_SUCCESS', 'Customer Success', 'Customer Success', 
         'Customer satisfaction, retention, support, onboarding', 
         'Customer satisfaction, retention, support, onboarding',
         'heart', 6, wheel_of_business_id)
    ON CONFLICT (domain_key) DO UPDATE SET
        wheel_id = EXCLUDED.wheel_id,
        title_nl = EXCLUDED.title_nl,
        title_en = EXCLUDED.title_en,
        description_nl = EXCLUDED.description_nl,
        description_en = EXCLUDED.description_en,
        display_order = EXCLUDED.display_order;

    INSERT INTO goals_okr.life_domains (domain_key, title_nl, title_en, description_nl, description_en, icon_name, display_order, wheel_id)
    VALUES 
        ('TEAM', 'Team / People', 'Team / People', 
         'Hiring, culture, development, performance', 
         'Hiring, culture, development, performance',
         'users', 7, wheel_of_business_id)
    ON CONFLICT (domain_key) DO UPDATE SET
        wheel_id = EXCLUDED.wheel_id,
        title_nl = EXCLUDED.title_nl,
        title_en = EXCLUDED.title_en,
        description_nl = EXCLUDED.description_nl,
        description_en = EXCLUDED.description_en,
        display_order = EXCLUDED.display_order;

    INSERT INTO goals_okr.life_domains (domain_key, title_nl, title_en, description_nl, description_en, icon_name, display_order, wheel_id)
    VALUES 
        ('TECHNOLOGY', 'Technology / IT', 'Technology / IT', 
         'Systems, infrastructure, security, automation', 
         'Systems, infrastructure, security, automation',
         'server', 8, wheel_of_business_id)
    ON CONFLICT (domain_key) DO UPDATE SET
        wheel_id = EXCLUDED.wheel_id,
        title_nl = EXCLUDED.title_nl,
        title_en = EXCLUDED.title_en,
        description_nl = EXCLUDED.description_nl,
        description_en = EXCLUDED.description_en,
        display_order = EXCLUDED.display_order;

    INSERT INTO goals_okr.life_domains (domain_key, title_nl, title_en, description_nl, description_en, icon_name, display_order, wheel_id)
    VALUES 
        ('INNOVATION', 'Innovation / R&D', 'Innovation / R&D', 
         'Nieuwe ideeën, experiments, research, prototypes', 
         'New ideas, experiments, research, prototypes',
         'lightbulb', 9, wheel_of_business_id)
    ON CONFLICT (domain_key) DO UPDATE SET
        wheel_id = EXCLUDED.wheel_id,
        title_nl = EXCLUDED.title_nl,
        title_en = EXCLUDED.title_en,
        description_nl = EXCLUDED.description_nl,
        description_en = EXCLUDED.description_en,
        display_order = EXCLUDED.display_order;

END $$;

-- Reset search path
RESET search_path;
