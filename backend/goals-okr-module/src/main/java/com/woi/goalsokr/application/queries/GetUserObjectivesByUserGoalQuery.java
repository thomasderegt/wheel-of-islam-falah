package com.woi.goalsokr.application.queries;

/**
 * Query to get all user-specific objectives for a user goal
 */
public record GetUserObjectivesByUserGoalQuery(Long userGoalId) {
    public GetUserObjectivesByUserGoalQuery {
        if (userGoalId == null) {
            throw new IllegalArgumentException("User Goal ID cannot be null");
        }
    }
}
