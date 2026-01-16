package com.woi.learning.application.queries;

/**
 * Query for getting all enrollments for a user
 */
public record GetEnrollmentsForUserQuery(
    Long userId
) {
    public GetEnrollmentsForUserQuery {
        if (userId == null) {
            throw new IllegalArgumentException("UserId cannot be null");
        }
    }
}

