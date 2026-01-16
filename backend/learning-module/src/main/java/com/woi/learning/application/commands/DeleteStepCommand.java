package com.woi.learning.application.commands;

/**
 * Command for deleting a learning flow step
 */
public record DeleteStepCommand(
    Long stepId
) {
    public DeleteStepCommand {
        if (stepId == null) {
            throw new IllegalArgumentException("StepId cannot be null");
        }
    }
}

