package com.woi.goalsokr.application.commands;

/**
 * Command to create a personal objective (creates Objective template + UserObjectiveInstance + Kanban item)
 * This follows the same pattern as CreatePersonalGoalCommand.
 */
public record CreatePersonalObjectiveCommand(
    Long userId,
    Long userGoalInstanceId, // Required - Objective belongs to a Goal
    String title,
    String description // Optional
) {
    public CreatePersonalObjectiveCommand {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (userGoalInstanceId == null) {
            throw new IllegalArgumentException("User Goal Instance ID cannot be null");
        }
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Title cannot be null or empty");
        }
    }
}
