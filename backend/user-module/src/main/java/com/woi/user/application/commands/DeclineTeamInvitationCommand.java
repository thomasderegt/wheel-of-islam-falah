package com.woi.user.application.commands;

/**
 * Command to decline a team invitation
 */
public record DeclineTeamInvitationCommand(
    String token,
    Long userId
) {
    public DeclineTeamInvitationCommand {
        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException("Token cannot be null or blank");
        }
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
    }
}
