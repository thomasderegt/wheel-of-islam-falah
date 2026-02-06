package com.woi.goalsokr.application.commands;

/**
 * Command to complete a user goal instance
 */
public record CompleteUserGoalInstanceCommand(
    Long userGoalInstanceId
) {
    public CompleteUserGoalInstanceCommand {
        if (userGoalInstanceId == null) {
            throw new IllegalArgumentException("User Goal Instance ID cannot be null");
        }
    }
}
