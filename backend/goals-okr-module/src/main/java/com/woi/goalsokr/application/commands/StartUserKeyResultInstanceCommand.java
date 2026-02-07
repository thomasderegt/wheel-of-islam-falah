package com.woi.goalsokr.application.commands;

/**
 * Command to start a new user key result instance
 */
public record StartUserKeyResultInstanceCommand(
    Long userId, // For validation only
    Long userObjectiveInstanceId, // FK to UserObjectiveInstance
    Long keyResultId
) {
    public StartUserKeyResultInstanceCommand {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (userObjectiveInstanceId == null) {
            throw new IllegalArgumentException("User Objective Instance ID cannot be null");
        }
        if (keyResultId == null) {
            throw new IllegalArgumentException("Key Result ID cannot be null");
        }
    }
}
