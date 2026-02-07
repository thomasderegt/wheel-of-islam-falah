package com.woi.goalsokr.application.queries;

/**
 * Query to get key result progress
 */
public record GetKeyResultProgressQuery(
    Long userId,
    Long keyResultId,
    Long userKeyResultInstanceId
) {
    public GetKeyResultProgressQuery {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (keyResultId == null) {
            throw new IllegalArgumentException("Key Result ID cannot be null");
        }
        if (userKeyResultInstanceId == null) {
            throw new IllegalArgumentException("User Key Result Instance ID cannot be null");
        }
    }
}
