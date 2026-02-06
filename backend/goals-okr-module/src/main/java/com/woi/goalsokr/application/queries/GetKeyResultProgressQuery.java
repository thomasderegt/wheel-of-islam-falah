package com.woi.goalsokr.application.queries;

/**
 * Query to get key result progress
 */
public record GetKeyResultProgressQuery(
    Long userId,
    Long keyResultId,
    Long userObjectiveInstanceId
) {
    public GetKeyResultProgressQuery {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (keyResultId == null) {
            throw new IllegalArgumentException("Key Result ID cannot be null");
        }
        if (userObjectiveInstanceId == null) {
            throw new IllegalArgumentException("User Objective Instance ID cannot be null");
        }
    }
}
