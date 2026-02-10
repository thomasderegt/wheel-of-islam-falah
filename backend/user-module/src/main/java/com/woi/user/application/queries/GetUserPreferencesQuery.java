package com.woi.user.application.queries;

/**
 * Query for getting user preferences by user ID
 */
public record GetUserPreferencesQuery(Long userId) {
    public GetUserPreferencesQuery {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
    }
}
