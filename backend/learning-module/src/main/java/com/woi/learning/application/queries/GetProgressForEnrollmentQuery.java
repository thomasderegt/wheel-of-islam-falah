package com.woi.learning.application.queries;

/**
 * Query for getting progress for all steps in an enrollment
 */
public record GetProgressForEnrollmentQuery(
    Long enrollmentId
) {
    public GetProgressForEnrollmentQuery {
        if (enrollmentId == null) {
            throw new IllegalArgumentException("EnrollmentId cannot be null");
        }
    }
}

