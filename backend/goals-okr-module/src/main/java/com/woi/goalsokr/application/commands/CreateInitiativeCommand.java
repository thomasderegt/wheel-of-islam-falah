package com.woi.goalsokr.application.commands;

import java.time.LocalDate;

/**
 * Command to create a new initiative (user-specific)
 */
public record CreateInitiativeCommand(
    Long userId,
    Long keyResultId,
    Long userKeyResultInstanceId,
    String title,
    String description,
    LocalDate targetDate,
    Long learningFlowEnrollmentId
) {
    public CreateInitiativeCommand {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (userKeyResultInstanceId == null) {
            throw new IllegalArgumentException("User Key Result Instance ID cannot be null");
        }
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Title cannot be null or empty");
        }
    }
}
