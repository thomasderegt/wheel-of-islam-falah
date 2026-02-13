-- =====================================================
-- Check Teams Migrations Status
-- =====================================================
-- This script checks if V54 and V55 migrations have been applied
-- Run this in your PostgreSQL database to verify migrations
-- =====================================================

-- Check Flyway migration history for V54 and V55
SELECT 
    version,
    description,
    type,
    script,
    checksum,
    installed_on,
    success
FROM flyway_schema_history
WHERE version IN ('54', '55')
ORDER BY version;

-- Check if teams table exists
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM information_schema.tables 
            WHERE table_schema = 'users' 
            AND table_name = 'teams'
        ) THEN 'EXISTS'
        ELSE 'MISSING'
    END AS teams_table_status;

-- Check if team_members table exists
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM information_schema.tables 
            WHERE table_schema = 'users' 
            AND table_name = 'team_members'
        ) THEN 'EXISTS'
        ELSE 'MISSING'
    END AS team_members_table_status;

-- Check if team_invitations table exists
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM information_schema.tables 
            WHERE table_schema = 'users' 
            AND table_name = 'team_invitations'
        ) THEN 'EXISTS'
        ELSE 'MISSING'
    END AS team_invitations_table_status;

-- Check if team_kanban_shares table exists
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM information_schema.tables 
            WHERE table_schema = 'users' 
            AND table_name = 'team_kanban_shares'
        ) THEN 'EXISTS'
        ELSE 'MISSING'
    END AS team_kanban_shares_table_status;

-- List all tables in users schema
SELECT 
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'users'
ORDER BY table_name;
