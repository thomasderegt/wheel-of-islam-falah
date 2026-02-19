package com.woi.goalsokr.application.queries;

/**
 * Query to get objectives for a life domain.
 * Returns templates (created_by_user_id IS NULL) + user's custom (created_by_user_id = userId).
 * When userId is null, only templates are returned.
 */
public record GetObjectivesByLifeDomainQuery(
    Long lifeDomainId,
    Long userId
) {
    public GetObjectivesByLifeDomainQuery {
        if (lifeDomainId == null) {
            throw new IllegalArgumentException("Life Domain ID cannot be null");
        }
    }
}
