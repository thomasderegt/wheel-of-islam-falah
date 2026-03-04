package com.woi.user.application.queries;

/**
 * Query to get a priority assessment.
 * If falahCycleId is null, returns the standalone assessment.
 */
public record GetPriorityAssessmentQuery(Long userId, Long falahCycleId) {
    public GetPriorityAssessmentQuery {
        if (userId == null) throw new IllegalArgumentException("userId cannot be null");
    }
}
