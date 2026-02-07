package com.woi.goalsokr.application.commands;

import java.time.LocalDate;

/**
 * Command to update an initiative
 */
public record UpdateInitiativeCommand(
    Long initiativeId,
    String title,
    String description,
    LocalDate targetDate,
    Long learningFlowEnrollmentId
) {
    public UpdateInitiativeCommand {
        if (initiativeId == null) {
            throw new IllegalArgumentException("Initiative ID cannot be null");
        }
    }
}
