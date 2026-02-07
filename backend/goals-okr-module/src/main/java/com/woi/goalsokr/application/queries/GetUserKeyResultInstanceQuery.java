package com.woi.goalsokr.application.queries;

/**
 * Query to get a user key result instance by ID
 */
public record GetUserKeyResultInstanceQuery(
    Long userKeyResultInstanceId
) {
    public GetUserKeyResultInstanceQuery {
        if (userKeyResultInstanceId == null) {
            throw new IllegalArgumentException("User Key Result Instance ID cannot be null");
        }
    }
}
