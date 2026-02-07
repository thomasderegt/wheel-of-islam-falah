package com.woi.goalsokr.application.queries;

/**
 * Query to get all user key result instances for a user
 */
public record GetUserKeyResultInstancesQuery(
    Long userId
) {
    public GetUserKeyResultInstancesQuery {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
    }
}
