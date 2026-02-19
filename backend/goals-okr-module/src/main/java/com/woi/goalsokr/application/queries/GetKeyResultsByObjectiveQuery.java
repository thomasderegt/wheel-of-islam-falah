package com.woi.goalsokr.application.queries;

/**
 * Query to get key results for an objective.
 * Returns templates (created_by_user_id IS NULL) + user's custom (created_by_user_id = userId).
 * When userId is null, only templates are returned.
 */
public record GetKeyResultsByObjectiveQuery(
    Long objectiveId,
    Long userId
) {
    public GetKeyResultsByObjectiveQuery {
        if (objectiveId == null) {
            throw new IllegalArgumentException("Objective ID cannot be null");
        }
    }
}
