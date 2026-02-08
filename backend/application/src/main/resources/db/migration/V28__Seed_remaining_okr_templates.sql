-- =====================================================
-- Flyway Migration V28: Seed Remaining OKR Templates
-- =====================================================
-- Seeds OKR templates (Goals, Objectives, Key Results) for remaining 5 life domains
-- Based on GOAL_TEMPLATES_OKR_V2.md
-- Structure: Life Domain → Goal → Objective → Key Result
-- Life Domains: WORK, EDUCATION, SOCIAL, SPORTS, REST
-- NOTE: This migration is now redundant - V21 already seeds all 10 life domains
-- This migration is kept for historical purposes but does nothing
-- =====================================================

-- Set search path to goals_okr schema
SET search_path TO goals_okr;

-- V21 already seeds all life domains, so this migration is now a no-op
-- All data is already present from V21

-- Reset search path
RESET search_path;
