package com.woi.goalsokr.application.commands;

/**
 * Command to create a new user-specific goal
 */
public record CreateUserGoalCommand(
    Long userId,
    Long lifeDomainId, // Optional
    String title,
    String description // Optional
) {
    public CreateUserGoalCommand {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Title cannot be null or empty");
        }
    }
}
