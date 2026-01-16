package com.woi.learning.application.commands;

import com.woi.learning.domain.enums.AnswerType;

/**
 * Command for adding an answer to a learning flow step
 */
public record AddAnswerCommand(
    Long enrollmentId,
    Long stepId,
    AnswerType type,
    String answerText
) {
    public AddAnswerCommand {
        if (enrollmentId == null) {
            throw new IllegalArgumentException("EnrollmentId cannot be null");
        }
        if (stepId == null) {
            throw new IllegalArgumentException("StepId cannot be null");
        }
        if (type == null) {
            throw new IllegalArgumentException("AnswerType cannot be null");
        }
        if (answerText == null || answerText.trim().isEmpty()) {
            throw new IllegalArgumentException("AnswerText cannot be null or empty");
        }
    }
}

