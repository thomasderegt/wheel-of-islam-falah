package com.woi.learning.application.queries;

import com.woi.learning.domain.enums.AnswerType;

/**
 * Query for getting answers for an enrollment step
 */
public record GetAnswersQuery(
    Long enrollmentId,
    Long stepId,
    AnswerType type  // Optional filter - null means get all answers
) {
    public GetAnswersQuery {
        if (enrollmentId == null) {
            throw new IllegalArgumentException("EnrollmentId cannot be null");
        }
        if (stepId == null) {
            throw new IllegalArgumentException("StepId cannot be null");
        }
        // type can be null (means get all answers)
    }
}

