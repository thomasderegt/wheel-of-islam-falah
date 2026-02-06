package com.woi.goalsokr.application.commands;

/**
 * Command to start a new user objective instance
 */
public record StartUserObjectiveInstanceCommand(
    Long userId, // For validation only
    Long userGoalInstanceId, // FK to UserGoalInstance (aggregate root)
    Long objectiveId
) {
    public StartUserObjectiveInstanceCommand {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (userGoalInstanceId == null) {
            throw new IllegalArgumentException("User Goal Instance ID cannot be null");
        }
        if (objectiveId == null) {
            throw new IllegalArgumentException("Objective ID cannot be null");
        }
    }
}
