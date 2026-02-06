package com.woi.goalsokr.application.queries;

/**
 * Query to get all key results for an objective
 */
public record GetKeyResultsByObjectiveQuery(
    Long objectiveId
) {
    public GetKeyResultsByObjectiveQuery {
        if (objectiveId == null) {
            throw new IllegalArgumentException("Objective ID cannot be null");
        }
    }
}
