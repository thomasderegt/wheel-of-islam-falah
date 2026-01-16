package com.woi.learning.api;

import java.time.LocalDateTime;

/**
 * LearningFlowTemplate summary - Public API value object
 * Used for module-to-module communication
 */
public record LearningFlowTemplateSummary(
    Long id,
    String name,
    String description,
    Long sectionId,
    LocalDateTime createdAt,
    Long createdBy
) {
    public LearningFlowTemplateSummary {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        if (sectionId == null) {
            throw new IllegalArgumentException("SectionId cannot be null");
        }
        if (createdBy == null) {
            throw new IllegalArgumentException("CreatedBy cannot be null");
        }
    }
}

