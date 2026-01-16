package com.woi.learning.application.queries;

/**
 * Query for getting an enrollment by ID
 */
public record GetEnrollmentQuery(
    Long enrollmentId
) {
    public GetEnrollmentQuery {
        if (enrollmentId == null) {
            throw new IllegalArgumentException("EnrollmentId cannot be null");
        }
    }
}

