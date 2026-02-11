package com.woi.user.application.commands;

/**
 * Command for inviting a team member
 */
public record InviteTeamMemberCommand(
    Long teamId,
    String email,
    String role, // OWNER, ADMIN, MEMBER
    Long invitedById
) {
    public InviteTeamMemberCommand {
        if (teamId == null) {
            throw new IllegalArgumentException("Team ID cannot be null");
        }
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }
        if (invitedById == null) {
            throw new IllegalArgumentException("Invited by ID cannot be null");
        }
    }
}
