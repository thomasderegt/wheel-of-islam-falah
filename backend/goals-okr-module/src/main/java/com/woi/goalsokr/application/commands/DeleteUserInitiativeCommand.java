package com.woi.goalsokr.application.commands;

/**
 * Command to delete a user initiative and its related instance(s) and kanban item(s).
 */
public record DeleteUserInitiativeCommand(
    Long initiativeId
) {
    public DeleteUserInitiativeCommand {
        if (initiativeId == null || initiativeId <= 0) {
            throw new IllegalArgumentException("Initiative ID must be a positive integer");
        }
    }
}
