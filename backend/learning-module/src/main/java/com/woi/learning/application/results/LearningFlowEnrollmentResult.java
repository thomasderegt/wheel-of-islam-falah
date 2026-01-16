package com.woi.learning.application.results;

import java.time.LocalDateTime;

/**
 * Result DTO for LearningFlowEnrollment operations
 */
public record LearningFlowEnrollmentResult(
    Long id,
    Long userId,
    Long templateId,
    Long sectionId,
    LocalDateTime startedAt,
    LocalDateTime completedAt
) {
    public static LearningFlowEnrollmentResult from(com.woi.learning.domain.entities.LearningFlowEnrollment enrollment) {
        return new LearningFlowEnrollmentResult(
            enrollment.getId(),
            enrollment.getUserId(),
            enrollment.getTemplateId(),
            enrollment.getSectionId(),
            enrollment.getStartedAt(),
            enrollment.getCompletedAt()
        );
    }
}

