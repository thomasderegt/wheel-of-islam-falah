package com.woi.goalsokr.application.commands;

/**
 * Command to complete a user key result instance
 */
public record CompleteUserKeyResultInstanceCommand(
    Long userKeyResultInstanceId
) {
    public CompleteUserKeyResultInstanceCommand {
        if (userKeyResultInstanceId == null) {
            throw new IllegalArgumentException("User Key Result Instance ID cannot be null");
        }
    }
}
