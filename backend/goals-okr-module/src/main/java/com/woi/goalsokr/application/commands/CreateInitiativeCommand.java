package com.woi.goalsokr.application.commands;

import java.time.LocalDate;

/**
 * Command to create a new initiative (user-specific)
 */
public record CreateInitiativeCommand(
    Long userId,
    Long keyResultId,
    Long userObjectiveInstanceId,
    String title,
    String description,
    LocalDate targetDate
) {
    public CreateInitiativeCommand {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (keyResultId == null) {
            throw new IllegalArgumentException("Key Result ID cannot be null");
        }
        if (userObjectiveInstanceId == null) {
            throw new IllegalArgumentException("User Objective Instance ID cannot be null");
        }
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Title cannot be null or empty");
        }
    }
}
