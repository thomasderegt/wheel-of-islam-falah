package com.woi.goalsokr.application.commands;

/**
 * Command to complete a user objective instance
 */
public record CompleteUserObjectiveInstanceCommand(
    Long userObjectiveInstanceId
) {
    public CompleteUserObjectiveInstanceCommand {
        if (userObjectiveInstanceId == null) {
            throw new IllegalArgumentException("User Objective Instance ID cannot be null");
        }
    }
}
