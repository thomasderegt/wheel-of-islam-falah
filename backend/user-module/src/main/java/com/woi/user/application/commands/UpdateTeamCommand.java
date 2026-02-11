package com.woi.user.application.commands;

/**
 * Command for updating a team
 */
public record UpdateTeamCommand(
    Long teamId,
    String name,
    String description,
    Long userId // For authorization
) {
    public UpdateTeamCommand {
        if (teamId == null) {
            throw new IllegalArgumentException("Team ID cannot be null");
        }
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
    }
}
