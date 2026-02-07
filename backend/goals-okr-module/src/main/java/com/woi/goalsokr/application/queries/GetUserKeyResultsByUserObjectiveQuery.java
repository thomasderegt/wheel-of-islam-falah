package com.woi.goalsokr.application.queries;

/**
 * Query to get all user-specific key results for a user objective
 */
public record GetUserKeyResultsByUserObjectiveQuery(Long userObjectiveId) {
    public GetUserKeyResultsByUserObjectiveQuery {
        if (userObjectiveId == null) {
            throw new IllegalArgumentException("User Objective ID cannot be null");
        }
    }
}
