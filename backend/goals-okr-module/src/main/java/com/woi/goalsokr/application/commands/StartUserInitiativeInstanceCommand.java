package com.woi.goalsokr.application.commands;

/**
 * Command to start a new user initiative instance
 */
public record StartUserInitiativeInstanceCommand(
    Long userId, // For validation only
    Long userKeyResultInstanceId, // FK to UserKeyResultInstance
    Long initiativeId
) {
    public StartUserInitiativeInstanceCommand {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (userKeyResultInstanceId == null) {
            throw new IllegalArgumentException("User Key Result Instance ID cannot be null");
        }
        if (initiativeId == null) {
            throw new IllegalArgumentException("Initiative ID cannot be null");
        }
    }
}
