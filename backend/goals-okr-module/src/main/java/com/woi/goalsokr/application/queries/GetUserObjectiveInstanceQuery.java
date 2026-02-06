package com.woi.goalsokr.application.queries;

/**
 * Query to get a user objective instance by ID
 */
public record GetUserObjectiveInstanceQuery(
    Long userObjectiveInstanceId
) {
    public GetUserObjectiveInstanceQuery {
        if (userObjectiveInstanceId == null) {
            throw new IllegalArgumentException("User Objective Instance ID cannot be null");
        }
    }
}
