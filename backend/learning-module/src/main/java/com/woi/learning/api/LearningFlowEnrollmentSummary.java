package com.woi.learning.api;

import java.time.LocalDateTime;

/**
 * LearningFlowEnrollment summary - Public API value object
 * Used for module-to-module communication
 */
public record LearningFlowEnrollmentSummary(
    Long id,
    Long userId,
    Long templateId,
    Long sectionId,
    LocalDateTime startedAt,
    LocalDateTime completedAt
) {
    public LearningFlowEnrollmentSummary {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        if (userId == null) {
            throw new IllegalArgumentException("UserId cannot be null");
        }
        if (templateId == null) {
            throw new IllegalArgumentException("TemplateId cannot be null");
        }
        if (sectionId == null) {
            throw new IllegalArgumentException("SectionId cannot be null");
        }
    }
}

