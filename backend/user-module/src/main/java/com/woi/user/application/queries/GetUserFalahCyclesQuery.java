package com.woi.user.application.queries;

/**
 * Query for fetching user's Falah cycles (active and history)
 */
public record GetUserFalahCyclesQuery(Long userId) {
    public GetUserFalahCyclesQuery {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
    }
}
