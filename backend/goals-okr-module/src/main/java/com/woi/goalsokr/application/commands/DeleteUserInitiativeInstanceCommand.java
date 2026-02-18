package com.woi.goalsokr.application.commands;

/**
 * Command to delete a user initiative instance (and its kanban item if present).
 */
public record DeleteUserInitiativeInstanceCommand(
    Long userInitiativeInstanceId
) {
    public DeleteUserInitiativeInstanceCommand {
        if (userInitiativeInstanceId == null || userInitiativeInstanceId <= 0) {
            throw new IllegalArgumentException("User initiative instance ID must be a positive integer");
        }
    }
}
