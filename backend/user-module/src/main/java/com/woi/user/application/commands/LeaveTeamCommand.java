package com.woi.user.application.commands;

/**
 * Command for leaving a team
 */
public record LeaveTeamCommand(
    Long teamId,
    Long userId
) {
    public LeaveTeamCommand {
        if (teamId == null) {
            throw new IllegalArgumentException("Team ID cannot be null");
        }
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
    }
}
