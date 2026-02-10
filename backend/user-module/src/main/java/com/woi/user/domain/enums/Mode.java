package com.woi.user.domain.enums;

/**
 * Mode enum - Defines the navigation/page mode
 * Determines which section of the application the user is in
 */
public enum Mode {
    SUCCESS,    // Success-Mode (home/categorynav)
    GOAL,       // Goal-Mode (goals-okr navigator)
    EXECUTE,    // Execute-Mode / Progress-Mode (kanban board)
    INSIGHT     // Insight-Mode (insights dashboard)
}
