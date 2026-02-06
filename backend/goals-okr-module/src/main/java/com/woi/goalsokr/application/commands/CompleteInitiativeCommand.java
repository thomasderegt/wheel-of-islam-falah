package com.woi.goalsokr.application.commands;

/**
 * Command to complete an initiative
 */
public record CompleteInitiativeCommand(
    Long initiativeId
) {
    public CompleteInitiativeCommand {
        if (initiativeId == null) {
            throw new IllegalArgumentException("Initiative ID cannot be null");
        }
    }
}
