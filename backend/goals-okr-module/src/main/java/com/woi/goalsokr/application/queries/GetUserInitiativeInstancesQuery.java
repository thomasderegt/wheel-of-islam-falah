package com.woi.goalsokr.application.queries;

/**
 * Query to get all user initiative instances for a user
 */
public record GetUserInitiativeInstancesQuery(
    Long userId
) {
    public GetUserInitiativeInstancesQuery {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
    }
}
