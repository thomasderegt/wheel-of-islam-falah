package com.woi.goalsokr.application.queries;

/**
 * Query to get a user goal instance by ID
 */
public record GetUserGoalInstanceQuery(
    Long userGoalInstanceId
) {
    public GetUserGoalInstanceQuery {
        if (userGoalInstanceId == null) {
            throw new IllegalArgumentException("User Goal Instance ID cannot be null");
        }
    }
}
