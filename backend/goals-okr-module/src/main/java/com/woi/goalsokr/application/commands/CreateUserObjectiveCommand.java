package com.woi.goalsokr.application.commands;

/**
 * Command to create a new user-specific objective
 */
public record CreateUserObjectiveCommand(
    Long userId,
    Long userGoalId,
    String title,
    String description // Optional
) {
    public CreateUserObjectiveCommand {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (userGoalId == null) {
            throw new IllegalArgumentException("User Goal ID cannot be null");
        }
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Title cannot be null or empty");
        }
    }
}
