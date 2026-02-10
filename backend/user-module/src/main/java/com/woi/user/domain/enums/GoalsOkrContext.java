package com.woi.user.domain.enums;

/**
 * Goals-OKR Context enum
 * 
 * Determines which Goals-OKR navigation items are shown:
 * - NONE: Hide Goal/Execute/Insight navigation items (default)
 * - LIFE: Show Wheel of Life navigation
 * - BUSINESS: Show Wheel of Business navigation
 * - WORK: Show Wheel of Work navigation
 */
public enum GoalsOkrContext {
    NONE,       // Hide Goal/Execute/Insight navigation items
    LIFE,       // Wheel of Life context
    BUSINESS,   // Wheel of Business context
    WORK        // Wheel of Work context
}
