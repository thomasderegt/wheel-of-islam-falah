package com.woi.goalsokr.domain.enums;

/**
 * Item type for kanban items
 */
public enum ItemType {
    GOAL,           // UserGoalInstance (template-based goals)
    USER_GOAL,      // UserGoal (user-created personal goals)
    OBJECTIVE,
    KEY_RESULT,
    INITIATIVE
}
