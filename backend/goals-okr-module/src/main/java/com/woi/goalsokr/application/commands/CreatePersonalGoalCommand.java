package com.woi.goalsokr.application.commands;

/**
 * Command to create a personal goal (creates Goal template + UserGoalInstance + Kanban item)
 * This is the new approach: Goal template + instance, instead of direct UserGoal creation.
 */
public record CreatePersonalGoalCommand(
    Long userId,
    Long lifeDomainId,
    String title,
    String description // Optional
) {
    public CreatePersonalGoalCommand {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (lifeDomainId == null) {
            throw new IllegalArgumentException("Life Domain ID cannot be null");
        }
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Title cannot be null or empty");
        }
    }
}
