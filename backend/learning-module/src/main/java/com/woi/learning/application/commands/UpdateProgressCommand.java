package com.woi.learning.application.commands;

import com.woi.learning.domain.enums.ProgressStatus;

/**
 * Command for updating progress for a learning flow step
 */
public record UpdateProgressCommand(
    Long enrollmentId,
    Long stepId,
    ProgressStatus status
) {
    public UpdateProgressCommand {
        if (enrollmentId == null) {
            throw new IllegalArgumentException("EnrollmentId cannot be null");
        }
        if (stepId == null) {
            throw new IllegalArgumentException("StepId cannot be null");
        }
        if (status == null) {
            throw new IllegalArgumentException("ProgressStatus cannot be null");
        }
    }
}

