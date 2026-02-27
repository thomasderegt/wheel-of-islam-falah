-- =====================================================
-- Flyway Migration V73: Delete Kanban Items and Reset Numbering
-- =====================================================
-- 1. Deletes all kanban items
-- 2. Resets all entity number sequences to 1 (fresh start)
-- =====================================================

SET search_path TO goals_okr;

-- 1. Delete all kanban items
DELETE FROM goals_okr.kanban_items;

-- 2. Reset number sequences to 1 (only sequences that exist - some were dropped with old tables)
DO $$
DECLARE
    seq_name TEXT;
    seq_names TEXT[] := ARRAY[
        'seq_objective_number', 'seq_key_result_number', 'seq_initiative_number',
        'seq_user_objective_instance_number', 'seq_user_key_result_instance_number',
        'seq_user_initiative_instance_number', 'seq_kanban_item_number'
    ];
BEGIN
    FOREACH seq_name IN ARRAY seq_names
    LOOP
        IF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'goals_okr' AND c.relname = seq_name AND c.relkind = 'S') THEN
            EXECUTE format('SELECT setval(''goals_okr.%I'', 1, false)', seq_name);
        END IF;
    END LOOP;
END $$;

RESET search_path;
