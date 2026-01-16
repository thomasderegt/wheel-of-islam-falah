package com.woi.learning.application.commands;

/**
 * Command for completing a learning flow enrollment
 */
public record CompleteEnrollmentCommand(
    Long enrollmentId
) {
    public CompleteEnrollmentCommand {
        if (enrollmentId == null) {
            throw new IllegalArgumentException("EnrollmentId cannot be null");
        }
    }
}

