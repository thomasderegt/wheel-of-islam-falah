package com.woi.user.application.queries;

/**
 * Query to get all members of a team
 */
public record GetTeamMembersQuery(
    Long teamId
) {
    public GetTeamMembersQuery {
        if (teamId == null) {
            throw new IllegalArgumentException("Team ID cannot be null");
        }
    }
}
