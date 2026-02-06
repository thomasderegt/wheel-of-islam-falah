package com.woi.goalsokr.application.queries;

/**
 * Query to get all user objective instances for a user
 */
public record GetUserObjectiveInstancesQuery(
    Long userId
) {
    public GetUserObjectiveInstancesQuery {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
    }
}
