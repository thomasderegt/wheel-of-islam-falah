package com.woi.goalsokr.application.queries;

/**
 * Query to get a key result by ID
 */
public record GetKeyResultQuery(
    Long keyResultId
) {
    public GetKeyResultQuery {
        if (keyResultId == null) {
            throw new IllegalArgumentException("Key Result ID cannot be null");
        }
    }
}
