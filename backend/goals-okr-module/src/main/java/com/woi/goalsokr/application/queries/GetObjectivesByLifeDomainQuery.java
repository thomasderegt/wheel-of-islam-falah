package com.woi.goalsokr.application.queries;

/**
 * Query to get all objectives for a life domain
 */
public record GetObjectivesByLifeDomainQuery(
    Long lifeDomainId
) {
    public GetObjectivesByLifeDomainQuery {
        if (lifeDomainId == null) {
            throw new IllegalArgumentException("Life Domain ID cannot be null");
        }
    }
}
