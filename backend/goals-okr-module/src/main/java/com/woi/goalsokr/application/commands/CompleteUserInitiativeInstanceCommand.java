package com.woi.goalsokr.application.commands;

/**
 * Command to complete a user initiative instance
 */
public record CompleteUserInitiativeInstanceCommand(
    Long userInitiativeInstanceId
) {
    public CompleteUserInitiativeInstanceCommand {
        if (userInitiativeInstanceId == null) {
            throw new IllegalArgumentException("User Initiative Instance ID cannot be null");
        }
    }
}
