package com.woi.user.application.queries;

/**
 * Query for getting roles for a user
 */
public record GetRolesQuery(Long userId) {
    public GetRolesQuery {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
    }
}

