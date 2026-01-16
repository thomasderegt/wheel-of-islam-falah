package com.woi.learning.application.queries;

/**
 * Query for getting progress for a specific step
 */
public record GetProgressForStepQuery(
    Long enrollmentId,
    Long stepId
) {
    public GetProgressForStepQuery {
        if (enrollmentId == null) {
            throw new IllegalArgumentException("EnrollmentId cannot be null");
        }
        if (stepId == null) {
            throw new IllegalArgumentException("StepId cannot be null");
        }
    }
}

