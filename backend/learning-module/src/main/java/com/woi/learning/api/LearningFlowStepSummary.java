package com.woi.learning.api;

/**
 * LearningFlowStep summary - Public API value object
 * Used for module-to-module communication
 */
public record LearningFlowStepSummary(
    Long id,
    Long templateId,
    Long paragraphId,
    Integer orderIndex,
    String questionText
) {
    public LearningFlowStepSummary {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        if (templateId == null) {
            throw new IllegalArgumentException("TemplateId cannot be null");
        }
        if (paragraphId == null) {
            throw new IllegalArgumentException("ParagraphId cannot be null");
        }
        if (orderIndex == null || orderIndex < 0) {
            throw new IllegalArgumentException("OrderIndex must be non-negative");
        }
    }
}

