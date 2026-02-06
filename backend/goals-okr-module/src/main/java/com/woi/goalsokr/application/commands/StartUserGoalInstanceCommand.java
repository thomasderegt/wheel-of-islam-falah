package com.woi.goalsokr.application.commands;

/**
 * Command to start a new user goal instance (subscription/enrollment)
 */
public record StartUserGoalInstanceCommand(
    Long userId,
    Long goalId
) {
    public StartUserGoalInstanceCommand {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (goalId == null) {
            throw new IllegalArgumentException("Goal ID cannot be null");
        }
    }
}
