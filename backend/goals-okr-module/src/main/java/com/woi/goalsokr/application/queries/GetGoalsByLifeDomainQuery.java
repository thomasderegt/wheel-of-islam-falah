package com.woi.goalsokr.application.queries;

/**
 * Query to get all goals for a life domain
 */
public record GetGoalsByLifeDomainQuery(
    Long lifeDomainId
) {
    public GetGoalsByLifeDomainQuery {
        if (lifeDomainId == null) {
            throw new IllegalArgumentException("Life Domain ID cannot be null");
        }
    }
}
