package com.woi.user.application.commands;

/**
 * Command to share a team kanban board
 */
public record ShareTeamKanbanCommand(
    Long teamId,
    Long ownerUserId
) {
    public ShareTeamKanbanCommand {
        if (teamId == null) {
            throw new IllegalArgumentException("Team ID cannot be null");
        }
        if (ownerUserId == null) {
            throw new IllegalArgumentException("Owner user ID cannot be null");
        }
    }
}
