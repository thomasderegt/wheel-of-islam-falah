package com.woi.goalsokr.application.queries;

/**
 * Query to get all user-specific goals for a user
 */
public record GetUserGoalsByUserQuery(Long userId) {
    public GetUserGoalsByUserQuery {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
    }
}
