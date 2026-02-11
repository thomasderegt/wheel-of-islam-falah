package com.woi.goalsokr.application.queries;

/**
 * Query to get kanban items for a team (read-only, from owner)
 */
public record GetTeamKanbanItemsQuery(
    Long teamId,
    Long viewingUserId // User viewing the team kanban board
) {
    public GetTeamKanbanItemsQuery {
        if (teamId == null) {
            throw new IllegalArgumentException("Team ID cannot be null");
        }
        if (viewingUserId == null) {
            throw new IllegalArgumentException("Viewing user ID cannot be null");
        }
    }
}
