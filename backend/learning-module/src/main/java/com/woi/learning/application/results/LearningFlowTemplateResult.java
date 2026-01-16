package com.woi.learning.application.results;

import java.time.LocalDateTime;

/**
 * Result DTO for LearningFlowTemplate operations
 */
public record LearningFlowTemplateResult(
    Long id,
    String name,
    String description,
    Long sectionId,
    LocalDateTime createdAt,
    Long createdBy
) {
    public static LearningFlowTemplateResult from(com.woi.learning.domain.entities.LearningFlowTemplate template) {
        return new LearningFlowTemplateResult(
            template.getId(),
            template.getName(),
            template.getDescription(),
            template.getSectionId(),
            template.getCreatedAt(),
            template.getCreatedBy()
        );
    }
}

