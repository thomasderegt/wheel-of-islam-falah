package com.woi.goalsokr.application.queries;

/**
 * Query to get all initiatives for a user objective instance
 */
public record GetInitiativesByUserObjectiveInstanceQuery(
    Long userObjectiveInstanceId
) {
    public GetInitiativesByUserObjectiveInstanceQuery {
        if (userObjectiveInstanceId == null) {
            throw new IllegalArgumentException("User Objective Instance ID cannot be null");
        }
    }
}
