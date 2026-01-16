package com.woi.user.application.queries;

/**
 * Query for checking if a user is active
 */
public record IsUserActiveQuery(Long userId) {
    public IsUserActiveQuery {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
    }
}

