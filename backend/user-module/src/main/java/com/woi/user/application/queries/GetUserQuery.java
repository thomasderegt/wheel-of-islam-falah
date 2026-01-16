package com.woi.user.application.queries;

/**
 * Query for getting a user by ID
 */
public record GetUserQuery(Long userId) {
    public GetUserQuery {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
    }
}

