package com.woi.goalsokr.application.queries;

/**
 * Query to get all user goal instances for a user (in which goals is user subscribed?)
 */
public record GetUserGoalInstancesByUserQuery(
    Long userId
) {
    public GetUserGoalInstancesByUserQuery {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
    }
}
