package com.woi.user.application.commands;

/**
 * Command to unshare a team kanban board
 */
public record UnshareTeamKanbanCommand(
    Long teamId,
    Long ownerUserId
) {
    public UnshareTeamKanbanCommand {
        if (teamId == null) {
            throw new IllegalArgumentException("Team ID cannot be null");
        }
        if (ownerUserId == null) {
            throw new IllegalArgumentException("Owner user ID cannot be null");
        }
    }
}
