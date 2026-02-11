package com.woi.user.application.queries;

/**
 * Query to get team kanban share (active or inactive)
 */
public record GetTeamKanbanShareQuery(
    Long teamId
) {
    public GetTeamKanbanShareQuery {
        if (teamId == null) {
            throw new IllegalArgumentException("Team ID cannot be null");
        }
    }
}
