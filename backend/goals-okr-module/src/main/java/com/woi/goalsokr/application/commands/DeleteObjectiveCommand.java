package com.woi.goalsokr.application.commands;

/**
 * Command to delete an objective (only allowed when no user has started it).
 */
public record DeleteObjectiveCommand(
    Long objectiveId
) {
    public DeleteObjectiveCommand {
        if (objectiveId == null || objectiveId <= 0) {
            throw new IllegalArgumentException("Objective ID must be a positive integer");
        }
    }
}
