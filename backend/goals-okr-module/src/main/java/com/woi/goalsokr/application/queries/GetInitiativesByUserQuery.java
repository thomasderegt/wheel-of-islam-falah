package com.woi.goalsokr.application.queries;

/**
 * Query to get all initiatives for a user
 */
public record GetInitiativesByUserQuery(
    Long userId
) {
    public GetInitiativesByUserQuery {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
    }
}
