package com.woi.goalsokr.application.queries;

/**
 * Query to get a user initiative instance by ID
 */
public record GetUserInitiativeInstanceQuery(
    Long userInitiativeInstanceId
) {
    public GetUserInitiativeInstanceQuery {
        if (userInitiativeInstanceId == null) {
            throw new IllegalArgumentException("User Initiative Instance ID cannot be null");
        }
    }
}
