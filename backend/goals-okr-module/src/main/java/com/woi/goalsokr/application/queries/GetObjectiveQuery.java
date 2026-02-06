package com.woi.goalsokr.application.queries;

/**
 * Query to get an objective by ID
 */
public record GetObjectiveQuery(
    Long objectiveId
) {
    public GetObjectiveQuery {
        if (objectiveId == null) {
            throw new IllegalArgumentException("Objective ID cannot be null");
        }
    }
}
