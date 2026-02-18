-- =====================================================
-- Flyway Migration V59: Seed 3 Initiatives per Key Result
-- =====================================================
-- Seeds 3 initiative templates for each key result (Religion OKRs from V58).
-- These appear as suggestions when users add initiatives to a key result.
-- =====================================================

SET search_path TO goals_okr;

-- OKR 1.1: All obligatory prayers completed on ≥25 days
INSERT INTO goals_okr.initiatives (key_result_id, title_nl, title_en, description_nl, description_en, learning_flow_template_id, display_order, created_at)
SELECT kr.id, t.title_nl, t.title_en, t.description_nl, t.description_en, NULL, t.ord, CURRENT_TIMESTAMP
FROM goals_okr.key_results kr
JOIN goals_okr.objectives o ON o.id = kr.objective_id
CROSS JOIN (VALUES
    ('Plan gebedstijden in agenda', 'Schedule prayer times in calendar', 'Blokkeer vaste momenten voor elk gebed in je agenda.', 'Block fixed moments for each prayer in your calendar.', 1),
    ('Gebruik gebed-app voor herinneringen', 'Use prayer app for reminders', 'Stel notificaties in om je te herinneren aan gebedstijden.', 'Set notifications to remind you of prayer times.', 2),
    ('Wekelijkse zelfevaluatie', 'Weekly self-evaluation', 'Review aan het eind van elke week: hoeveel gebeden voltooid?', 'Review at end of each week: how many prayers completed?', 3)
) AS t(title_nl, title_en, description_nl, description_en, ord)
WHERE kr.title_en = 'All obligatory prayers completed on ≥25 days' AND o.life_domain_id = (SELECT id FROM goals_okr.life_domains WHERE domain_key = 'RELIGION')
  AND NOT EXISTS (SELECT 1 FROM goals_okr.initiatives WHERE key_result_id = kr.id);

-- OKR 1.2: Fajr on time on ≥22 days
INSERT INTO goals_okr.initiatives (key_result_id, title_nl, title_en, description_nl, description_en, learning_flow_template_id, display_order, created_at)
SELECT kr.id, t.title_nl, t.title_en, t.description_nl, t.description_en, NULL, t.ord, CURRENT_TIMESTAMP
FROM goals_okr.key_results kr
JOIN goals_okr.objectives o ON o.id = kr.objective_id
CROSS JOIN (VALUES
    ('Zet ochtend alarm op', 'Set up morning alarm', 'Creëer een routine om op tijd wakker te worden voor Fajr.', 'Create a routine to wake up on time for Fajr.', 1),
    ('Slapen voor 23:00', 'Sleep before 11pm', 'Ga eerder naar bed voor voldoende rust voor de ochtend.', 'Go to bed earlier for sufficient rest before morning.', 2),
    ('Sluit je aan bij ochtend gebed groep', 'Join morning prayer group', 'Vind een gemeenschap om samen Fajr te bidden voor accountability.', 'Find a community to pray Fajr together for accountability.', 3)
) AS t(title_nl, title_en, description_nl, description_en, ord)
WHERE kr.title_en = 'Fajr on time on ≥22 days' AND o.life_domain_id = (SELECT id FROM goals_okr.life_domains WHERE domain_key = 'RELIGION')
  AND NOT EXISTS (SELECT 1 FROM goals_okr.initiatives WHERE key_result_id = kr.id);

-- OKR 1.3: Khushu self-rating averages ≥7/10
INSERT INTO goals_okr.initiatives (key_result_id, title_nl, title_en, description_nl, description_en, learning_flow_template_id, display_order, created_at)
SELECT kr.id, t.title_nl, t.title_en, t.description_nl, t.description_en, NULL, t.ord, CURRENT_TIMESTAMP
FROM goals_okr.key_results kr
JOIN goals_okr.objectives o ON o.id = kr.objective_id
CROSS JOIN (VALUES
    ('Leer over khushu en concentratie', 'Learn about khushu and concentration', 'Bestudeer wat khushu betekent en hoe je het kunt verbeteren.', 'Study what khushu means and how to improve it.', 1),
    ('Wudu met intentie voor gebed', 'Wudu with intention for prayer', 'Neem extra tijd voor wudu als voorbereiding op gebed.', 'Take extra time for wudu as preparation for prayer.', 2),
    ('Dagelijkse khushu-score bijhouden', 'Track daily khushu score', 'Noteer na elk gebed een score van 1-10 voor reflectie.', 'Note a 1-10 score after each prayer for reflection.', 3)
) AS t(title_nl, title_en, description_nl, description_en, ord)
WHERE kr.title_en = 'Khushu self-rating averages ≥7/10 across the period' AND o.life_domain_id = (SELECT id FROM goals_okr.life_domains WHERE domain_key = 'RELIGION')
  AND NOT EXISTS (SELECT 1 FROM goals_okr.initiatives WHERE key_result_id = kr.id);

-- OKR 2.1: Reflected on and understood the meaning of 20 passages or surahs
INSERT INTO goals_okr.initiatives (key_result_id, title_nl, title_en, description_nl, description_en, learning_flow_template_id, display_order, created_at)
SELECT kr.id, t.title_nl, t.title_en, t.description_nl, t.description_en, NULL, t.ord, CURRENT_TIMESTAMP
FROM goals_okr.key_results kr
JOIN goals_okr.objectives o ON o.id = kr.objective_id
CROSS JOIN (VALUES
    ('Kies een tafsir of uitleg bron', 'Choose a tafsir or commentary source', 'Selecteer een betrouwbare bron voor diepere betekenis van verzen.', 'Select a reliable source for deeper meaning of verses.', 1),
    ('Wekelijkse reflectie sessie', 'Weekly reflection session', 'Plan een vast moment om over gelezen passages na te denken.', 'Plan a fixed moment to reflect on read passages.', 2),
    ('Schrijf reflecties op', 'Write reflections down', 'Documenteer je inzichten per passage voor verdieping.', 'Document your insights per passage for depth.', 3)
) AS t(title_nl, title_en, description_nl, description_en, ord)
WHERE kr.title_en = 'Reflected on and understood the meaning of 20 passages or surahs' AND o.life_domain_id = (SELECT id FROM goals_okr.life_domains WHERE domain_key = 'RELIGION')
  AND NOT EXISTS (SELECT 1 FROM goals_okr.initiatives WHERE key_result_id = kr.id);

-- OKR 2.2: Memorized 5–10 verses
INSERT INTO goals_okr.initiatives (key_result_id, title_nl, title_en, description_nl, description_en, learning_flow_template_id, display_order, created_at)
SELECT kr.id, t.title_nl, t.title_en, t.description_nl, t.description_en, NULL, t.ord, CURRENT_TIMESTAMP
FROM goals_okr.key_results kr
JOIN goals_okr.objectives o ON o.id = kr.objective_id
CROSS JOIN (VALUES
    ('Kies verzen om te memoriseren', 'Choose verses to memorize', 'Selecteer 5-10 verzen die je wilt onthouden deze periode.', 'Select 5-10 verses you want to memorize this period.', 1),
    ('Dagelijkse herhaling routine', 'Daily repetition routine', 'Herhaal de verzen elke dag op een vast moment.', 'Repeat the verses every day at a fixed time.', 2),
    ('Test jezelf aan periode-einde', 'Test yourself at period end', 'Reciteer de verzen uit het hoofd om te controleren of je ze kent.', 'Recite the verses from memory to verify you know them.', 3)
) AS t(title_nl, title_en, description_nl, description_en, ord)
WHERE kr.title_en = 'Memorized 5–10 verses and correctly recalled them at period end' AND o.life_domain_id = (SELECT id FROM goals_okr.life_domains WHERE domain_key = 'RELIGION')
  AND NOT EXISTS (SELECT 1 FROM goals_okr.initiatives WHERE key_result_id = kr.id);

-- OKR 2.3: Applied 5 Qur'anic lessons
INSERT INTO goals_okr.initiatives (key_result_id, title_nl, title_en, description_nl, description_en, learning_flow_template_id, display_order, created_at)
SELECT kr.id, t.title_nl, t.title_en, t.description_nl, t.description_en, NULL, t.ord, CURRENT_TIMESTAMP
FROM goals_okr.key_results kr
JOIN goals_okr.objectives o ON o.id = kr.objective_id
CROSS JOIN (VALUES
    ('Identificeer beslissingsmomenten', 'Identify decision moments', 'Let op situaties waar je een keuze moet maken.', 'Pay attention to situations where you must make a choice.', 1),
    ('Koppel verzen aan situaties', 'Link verses to situations', 'Noteer welke Qur''anische les van toepassing was per situatie.', 'Note which Qur''anic lesson applied per situation.', 2),
    ('Deel voorbeelden met anderen', 'Share examples with others', 'Bespreken hoe je de Qur''an toepaste versterkt het leren.', 'Discussing how you applied the Qur''an reinforces learning.', 3)
) AS t(title_nl, title_en, description_nl, description_en, ord)
WHERE kr.title_en = 'Applied 5 Qur''anic lessons to real-life decisions or behavior' AND o.life_domain_id = (SELECT id FROM goals_okr.life_domains WHERE domain_key = 'RELIGION')
  AND NOT EXISTS (SELECT 1 FROM goals_okr.initiatives WHERE key_result_id = kr.id);

-- OKR 3.1: Spiritual mindfulness self-score improves by +2 points
INSERT INTO goals_okr.initiatives (key_result_id, title_nl, title_en, description_nl, description_en, learning_flow_template_id, display_order, created_at)
SELECT kr.id, t.title_nl, t.title_en, t.description_nl, t.description_en, NULL, t.ord, CURRENT_TIMESTAMP
FROM goals_okr.key_results kr
JOIN goals_okr.objectives o ON o.id = kr.objective_id
CROSS JOIN (VALUES
    ('Start met een nulmeting', 'Start with a baseline measurement', 'Geef jezelf nu een score (1-10) voor spirituele mindfulness.', 'Give yourself a baseline score (1-10) for spiritual mindfulness.', 1),
    ('Dagelijkse dhikr momenten', 'Daily dhikr moments', 'Plan korte momenten van dhikr verspreid over de dag.', 'Plan short moments of dhikr spread throughout the day.', 2),
    ('Maandelijkse herscore', 'Monthly re-score', 'Evalueer je score maandelijks om verbetering te zien.', 'Evaluate your score monthly to see improvement.', 3)
) AS t(title_nl, title_en, description_nl, description_en, ord)
WHERE kr.title_en = 'Spiritual mindfulness self-score improves by +2 points' AND o.life_domain_id = (SELECT id FROM goals_okr.life_domains WHERE domain_key = 'RELIGION')
  AND NOT EXISTS (SELECT 1 FROM goals_okr.initiatives WHERE key_result_id = kr.id);

-- OKR 3.2: Documented 10 moments where dhikr or duʿāʾ changed a reaction or choice
INSERT INTO goals_okr.initiatives (key_result_id, title_nl, title_en, description_nl, description_en, learning_flow_template_id, display_order, created_at)
SELECT kr.id, t.title_nl, t.title_en, t.description_nl, t.description_en, NULL, t.ord, CURRENT_TIMESTAMP
FROM goals_okr.key_results kr
JOIN goals_okr.objectives o ON o.id = kr.objective_id
CROSS JOIN (VALUES
    ('Houd een dagboek bij', 'Keep a journal', 'Noteer momenten waar dhikr of duʿāʾ je reactie veranderde.', 'Note moments where dhikr or duʿāʾ changed your reaction.', 1),
    ('Reflecteer na moeilijke momenten', 'Reflect after difficult moments', 'Neem na stress of conflict even tijd om te documenteren.', 'Take time after stress or conflict to document.', 2),
    ('Deel met een vertrouwenspersoon', 'Share with a confidant', 'Bespreken van voorbeelden kan nieuwe inzichten geven.', 'Discussing examples can provide new insights.', 3)
) AS t(title_nl, title_en, description_nl, description_en, ord)
WHERE kr.title_en = 'Documented 10 moments where dhikr or duʿāʾ changed a reaction or choice' AND o.life_domain_id = (SELECT id FROM goals_okr.life_domains WHERE domain_key = 'RELIGION')
  AND NOT EXISTS (SELECT 1 FROM goals_okr.initiatives WHERE key_result_id = kr.id);

-- OKR 3.3: Reduced one recurring heedless habit measurably
INSERT INTO goals_okr.initiatives (key_result_id, title_nl, title_en, description_nl, description_en, learning_flow_template_id, display_order, created_at)
SELECT kr.id, t.title_nl, t.title_en, t.description_nl, t.description_en, NULL, t.ord, CURRENT_TIMESTAMP
FROM goals_okr.key_results kr
JOIN goals_okr.objectives o ON o.id = kr.objective_id
CROSS JOIN (VALUES
    ('Kies één gewoonte om aan te werken', 'Choose one habit to work on', 'Identificeer de meest impactvolle onoplettende gewoonte.', 'Identify the most impactful heedless habit.', 1),
    ('Vervang door bewuste actie', 'Replace with conscious action', 'Bepaal wat je doet in plaats van de oude gewoonte.', 'Determine what you do instead of the old habit.', 2),
    ('Meet je voortgang wekelijks', 'Measure progress weekly', 'Houd bij hoe vaak de gewoonte nog voorkomt.', 'Track how often the habit still occurs.', 3)
) AS t(title_nl, title_en, description_nl, description_en, ord)
WHERE kr.title_en = 'Reduced one recurring heedless habit measurably' AND o.life_domain_id = (SELECT id FROM goals_okr.life_domains WHERE domain_key = 'RELIGION')
  AND NOT EXISTS (SELECT 1 FROM goals_okr.initiatives WHERE key_result_id = kr.id);

RESET search_path;
