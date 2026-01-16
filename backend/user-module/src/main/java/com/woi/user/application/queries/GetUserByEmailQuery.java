package com.woi.user.application.queries;

/**
 * Query for getting a user by email
 */
public record GetUserByEmailQuery(String email) {
    public GetUserByEmailQuery {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }
    }
}

