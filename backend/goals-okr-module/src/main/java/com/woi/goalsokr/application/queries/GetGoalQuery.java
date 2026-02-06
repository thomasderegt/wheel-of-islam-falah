package com.woi.goalsokr.application.queries;

/**
 * Query to get a goal by ID
 */
public record GetGoalQuery(
    Long goalId
) {
    public GetGoalQuery {
        if (goalId == null) {
            throw new IllegalArgumentException("Goal ID cannot be null");
        }
    }
}
