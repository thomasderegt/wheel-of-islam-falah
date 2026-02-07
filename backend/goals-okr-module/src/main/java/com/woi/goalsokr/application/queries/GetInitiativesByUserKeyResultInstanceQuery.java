package com.woi.goalsokr.application.queries;

/**
 * Query to get all initiatives for a user key result instance
 */
public record GetInitiativesByUserKeyResultInstanceQuery(
    Long userKeyResultInstanceId
) {
    public GetInitiativesByUserKeyResultInstanceQuery {
        if (userKeyResultInstanceId == null) {
            throw new IllegalArgumentException("User Key Result Instance ID cannot be null");
        }
    }
}
