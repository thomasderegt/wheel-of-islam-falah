package com.woi.learning.application.results;

import com.woi.learning.domain.enums.ProgressStatus;
import java.time.LocalDateTime;

/**
 * Result DTO for EnrollmentStepProgress operations
 */
public record EnrollmentStepProgressResult(
    Long id,
    Long enrollmentId,
    Long stepId,
    ProgressStatus status,
    LocalDateTime updatedAt
) {
    public static EnrollmentStepProgressResult from(com.woi.learning.domain.entities.LearningFlowEnrollmentStepProgress progress) {
        return new EnrollmentStepProgressResult(
            progress.getId(),
            progress.getEnrollmentId(),
            progress.getStepId(),
            progress.getStatus(),
            progress.getUpdatedAt()
        );
    }
}

