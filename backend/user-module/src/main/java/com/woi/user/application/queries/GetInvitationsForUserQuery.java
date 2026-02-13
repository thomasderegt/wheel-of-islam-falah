package com.woi.user.application.queries;

/**
 * Query to get all pending invitations for the authenticated user (by email)
 */
public record GetInvitationsForUserQuery(
    Long userId
) {
    public GetInvitationsForUserQuery {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
    }
}
