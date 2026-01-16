package com.woi.learning.api;

import java.time.LocalDateTime;

/**
 * EnrollmentAnswer summary - Public API value object
 * Used for module-to-module communication
 */
public record EnrollmentAnswerSummary(
    Long id,
    Long enrollmentId,
    Long stepId,
    AnswerType type,
    String answerText,
    LocalDateTime createdAt
) {
    public EnrollmentAnswerSummary {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        if (enrollmentId == null) {
            throw new IllegalArgumentException("EnrollmentId cannot be null");
        }
        if (stepId == null) {
            throw new IllegalArgumentException("StepId cannot be null");
        }
        if (type == null) {
            throw new IllegalArgumentException("AnswerType cannot be null");
        }
    }
}

