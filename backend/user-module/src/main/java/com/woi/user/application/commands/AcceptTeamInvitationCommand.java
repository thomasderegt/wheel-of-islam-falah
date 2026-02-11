package com.woi.user.application.commands;

/**
 * Command for accepting a team invitation
 */
public record AcceptTeamInvitationCommand(
    String token,
    Long userId
) {
    public AcceptTeamInvitationCommand {
        if (token == null || token.trim().isEmpty()) {
            throw new IllegalArgumentException("Token cannot be null or empty");
        }
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
    }
}
