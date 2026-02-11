package com.woi.user.application.queries;

/**
 * Query to get a team by ID
 */
public record GetTeamQuery(
    Long teamId
) {
    public GetTeamQuery {
        if (teamId == null) {
            throw new IllegalArgumentException("Team ID cannot be null");
        }
    }
}
