package com.woi.user.application.commands;

/**
 * Command for removing a team member
 */
public record RemoveTeamMemberCommand(
    Long teamId,
    Long memberId,
    Long userId // For authorization
) {
    public RemoveTeamMemberCommand {
        if (teamId == null) {
            throw new IllegalArgumentException("Team ID cannot be null");
        }
        if (memberId == null) {
            throw new IllegalArgumentException("Member ID cannot be null");
        }
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
    }
}
