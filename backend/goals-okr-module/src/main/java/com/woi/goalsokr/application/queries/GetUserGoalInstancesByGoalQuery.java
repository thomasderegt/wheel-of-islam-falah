package com.woi.goalsokr.application.queries;

/**
 * Query to get all user goal instances for a goal (which users are subscribed to this goal?)
 */
public record GetUserGoalInstancesByGoalQuery(
    Long goalId
) {
    public GetUserGoalInstancesByGoalQuery {
        if (goalId == null) {
            throw new IllegalArgumentException("Goal ID cannot be null");
        }
    }
}
