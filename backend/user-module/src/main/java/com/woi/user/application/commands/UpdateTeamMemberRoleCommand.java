package com.woi.user.application.commands;

/**
 * Command for updating a team member's role
 */
public record UpdateTeamMemberRoleCommand(
    Long teamId,
    Long memberId,
    String newRole,
    Long userId // For authorization
) {
    public UpdateTeamMemberRoleCommand {
        if (teamId == null) {
            throw new IllegalArgumentException("Team ID cannot be null");
        }
        if (memberId == null) {
            throw new IllegalArgumentException("Member ID cannot be null");
        }
        if (newRole == null || newRole.trim().isEmpty()) {
            throw new IllegalArgumentException("Role cannot be null or empty");
        }
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
    }
}
