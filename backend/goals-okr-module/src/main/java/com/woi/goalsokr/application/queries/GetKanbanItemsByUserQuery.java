package com.woi.goalsokr.application.queries;

/**
 * Query to get all kanban items for a user
 */
public record GetKanbanItemsByUserQuery(
    Long userId
) {
    public GetKanbanItemsByUserQuery {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
    }
}
