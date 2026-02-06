package com.woi.goalsokr.application.queries;

/**
 * Query to get an initiative by ID
 */
public record GetInitiativeQuery(
    Long initiativeId
) {
    public GetInitiativeQuery {
        if (initiativeId == null) {
            throw new IllegalArgumentException("Initiative ID cannot be null");
        }
    }
}
