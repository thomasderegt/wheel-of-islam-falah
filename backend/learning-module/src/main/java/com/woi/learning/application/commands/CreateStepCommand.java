package com.woi.learning.application.commands;

/**
 * Command for creating a new learning flow step
 */
public record CreateStepCommand(
    Long templateId,
    Long paragraphId,
    Integer orderIndex,
    String questionText
) {
    public CreateStepCommand {
        if (templateId == null) {
            throw new IllegalArgumentException("TemplateId cannot be null");
        }
        if (paragraphId == null) {
            throw new IllegalArgumentException("ParagraphId cannot be null");
        }
        if (orderIndex == null || orderIndex < 0) {
            throw new IllegalArgumentException("OrderIndex must be non-negative");
        }
        if (questionText == null || questionText.trim().isEmpty()) {
            throw new IllegalArgumentException("QuestionText cannot be null or empty");
        }
    }
}

