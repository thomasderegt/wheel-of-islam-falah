package com.woi.goalsokr.application.commands;

/**
 * Command to start a new user objective instance
 */
public record StartUserObjectiveInstanceCommand(
    Long userId,
    Long objectiveId
) {
    public StartUserObjectiveInstanceCommand {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (objectiveId == null) {
            throw new IllegalArgumentException("Objective ID cannot be null");
        }
    }
}
