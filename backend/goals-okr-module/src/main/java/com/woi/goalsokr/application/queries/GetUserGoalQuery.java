package com.woi.goalsokr.application.queries;

/**
 * Query to get a user goal by ID
 */
public record GetUserGoalQuery(Long userGoalId) {
    public GetUserGoalQuery {
        if (userGoalId == null || userGoalId <= 0) {
            throw new IllegalArgumentException("User Goal ID must be a positive integer");
        }
    }
}
