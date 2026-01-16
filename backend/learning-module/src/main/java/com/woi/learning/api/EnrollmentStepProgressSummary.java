package com.woi.learning.api;

import java.time.LocalDateTime;

/**
 * EnrollmentStepProgress summary - Public API value object
 * Used for module-to-module communication
 */
public record EnrollmentStepProgressSummary(
    Long id,
    Long enrollmentId,
    Long stepId,
    ProgressStatus status,
    LocalDateTime updatedAt
) {
    public EnrollmentStepProgressSummary {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        if (enrollmentId == null) {
            throw new IllegalArgumentException("EnrollmentId cannot be null");
        }
        if (stepId == null) {
            throw new IllegalArgumentException("StepId cannot be null");
        }
        if (status == null) {
            throw new IllegalArgumentException("ProgressStatus cannot be null");
        }
    }
}

