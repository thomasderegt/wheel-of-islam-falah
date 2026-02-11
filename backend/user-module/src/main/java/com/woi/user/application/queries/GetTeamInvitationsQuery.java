package com.woi.user.application.queries;

/**
 * Query to get all invitations for a team
 */
public record GetTeamInvitationsQuery(
    Long teamId
) {
    public GetTeamInvitationsQuery {
        if (teamId == null) {
            throw new IllegalArgumentException("Team ID cannot be null");
        }
    }
}
