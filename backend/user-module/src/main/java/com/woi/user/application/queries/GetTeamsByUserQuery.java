package com.woi.user.application.queries;

/**
 * Query to get all teams for a user
 */
public record GetTeamsByUserQuery(
    Long userId
) {
    public GetTeamsByUserQuery {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
    }
}
