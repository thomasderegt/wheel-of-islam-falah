package com.woi.learning.application.results;

/**
 * Result DTO for LearningFlowStep operations
 */
public record LearningFlowStepResult(
    Long id,
    Long templateId,
    Long paragraphId,
    Integer orderIndex,
    String questionText
) {
    public static LearningFlowStepResult from(com.woi.learning.domain.entities.LearningFlowStep step) {
        return new LearningFlowStepResult(
            step.getId(),
            step.getTemplateId(),
            step.getParagraphId(),
            step.getOrderIndex(),
            step.getQuestionText()
        );
    }
}

