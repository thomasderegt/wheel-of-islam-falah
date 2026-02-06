-- =====================================================
-- Flyway Migration V14: Seed Life Domains
-- =====================================================
-- Seeds the default life domains for 360° goals assessment
-- =====================================================

-- Set search path to goals schema
SET search_path TO goals;

-- Seed life domains (only if they don't exist)
INSERT INTO goals.life_domains (domain_key, title_nl, title_en, description_nl, description_en, icon_name, display_order)
VALUES 
    ('RELIGION', 'Religie / ʿIbādah', 'Religion / ʿIbādah', 
     'Salaat, Qur''an lezen, dhikr, spirituele groei', 
     'Salaat, reading Qur''an, dhikr, spiritual growth',
     'prayer', 1)
ON CONFLICT (domain_key) DO NOTHING;

INSERT INTO goals.life_domains (domain_key, title_nl, title_en, description_nl, description_en, icon_name, display_order)
VALUES 
    ('FAMILY', 'Gezin / Familie', 'Family', 
     'Relaties met familie, tijd met gezin, familieverantwoordelijkheden', 
     'Family relationships, time with family, family responsibilities',
     'family', 2)
ON CONFLICT (domain_key) DO NOTHING;

INSERT INTO goals.life_domains (domain_key, title_nl, title_en, description_nl, description_en, icon_name, display_order)
VALUES 
    ('WORK', 'Werk / Carrière', 'Work / Career', 
     'Professionele groei, vaardigheden, carrièreontwikkeling', 
     'Professional growth, skills, career development',
     'briefcase', 3)
ON CONFLICT (domain_key) DO NOTHING;

INSERT INTO goals.life_domains (domain_key, title_nl, title_en, description_nl, description_en, icon_name, display_order)
VALUES 
    ('HEALTH', 'Gezondheid', 'Health', 
     'Fysieke gezondheid, mentale gezondheid, voeding, welzijn', 
     'Physical health, mental health, nutrition, wellbeing',
     'heart', 4)
ON CONFLICT (domain_key) DO NOTHING;

INSERT INTO goals.life_domains (domain_key, title_nl, title_en, description_nl, description_en, icon_name, display_order)
VALUES 
    ('FINANCE', 'Financiën', 'Finance', 
     'Sparen, investeren, zakāt, financiële planning', 
     'Saving, investing, zakāt, financial planning',
     'dollar-sign', 5)
ON CONFLICT (domain_key) DO NOTHING;

INSERT INTO goals.life_domains (domain_key, title_nl, title_en, description_nl, description_en, icon_name, display_order)
VALUES 
    ('EDUCATION', 'Onderwijs / Leren', 'Education / Learning', 
     'Kennis verwerven, vaardigheden ontwikkelen, persoonlijke groei', 
     'Acquiring knowledge, developing skills, personal growth',
     'book-open', 6)
ON CONFLICT (domain_key) DO NOTHING;

INSERT INTO goals.life_domains (domain_key, title_nl, title_en, description_nl, description_en, icon_name, display_order)
VALUES 
    ('SOCIAL', 'Sociale Relaties', 'Social Relationships', 
     'Vriendschappen, gemeenschap, sociale connecties', 
     'Friendships, community, social connections',
     'users', 7)
ON CONFLICT (domain_key) DO NOTHING;

INSERT INTO goals.life_domains (domain_key, title_nl, title_en, description_nl, description_en, icon_name, display_order)
VALUES 
    ('PERSONAL_GROWTH', 'Persoonlijke Groei', 'Personal Growth', 
     'Tazkiyyah, zelfontwikkeling, karakterontwikkeling', 
     'Tazkiyyah, self-development, character development',
     'sparkles', 8)
ON CONFLICT (domain_key) DO NOTHING;

INSERT INTO goals.life_domains (domain_key, title_nl, title_en, description_nl, description_en, icon_name, display_order)
VALUES 
    ('SPORTS', 'Sport / Beweging', 'Sports / Exercise', 
     'Fitness, fysieke activiteiten, sport', 
     'Fitness, physical activities, sports',
     'activity', 9)
ON CONFLICT (domain_key) DO NOTHING;

INSERT INTO goals.life_domains (domain_key, title_nl, title_en, description_nl, description_en, icon_name, display_order)
VALUES 
    ('REST', 'Rust / Recreatie', 'Rest / Recreation', 
     'Balans, ontspanning, vrije tijd', 
     'Balance, relaxation, leisure time',
     'moon', 10)
ON CONFLICT (domain_key) DO NOTHING;

-- Reset search path
RESET search_path;
