package com.woi.goalsokr.application.queries;

/**
 * Query to get all objectives for a goal
 */
public record GetObjectivesByGoalQuery(
    Long goalId
) {
    public GetObjectivesByGoalQuery {
        if (goalId == null) {
            throw new IllegalArgumentException("Goal ID cannot be null");
        }
    }
}
