package com.woi.user.domain.enums;

/**
 * Goals-OKR Context enum
 * 
 * Determines which Goals-OKR navigation items are shown:
 * - NONE: Hide Goal/Execute/Insight navigation items (default)
 * - LIFE: Show Wheel of Life navigation
 * - BUSINESS: Show Wheel of Business navigation
 * - WORK: Show Wheel of Work navigation
 * - ALL: Show all wheels (LIFE, BUSINESS, WORK) - no filtering by wheel
 */
public enum GoalsOkrContext {
    NONE,       // Hide Goal/Execute/Insight navigation items
    LIFE,       // Wheel of Life context
    BUSINESS,   // Wheel of Business context
    WORK,       // Wheel of Work context
    ALL         // Show all wheels (no filtering)
}
