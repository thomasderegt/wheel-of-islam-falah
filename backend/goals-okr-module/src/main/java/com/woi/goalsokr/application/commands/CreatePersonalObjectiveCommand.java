package com.woi.goalsokr.application.commands;

/**
 * Command to create a personal objective (creates Objective template + UserObjectiveInstance + Kanban item)
 */
public record CreatePersonalObjectiveCommand(
    Long userId,
    Long lifeDomainId, // Life domain for the new objective
    String title,
    String description // Optional
) {
    public CreatePersonalObjectiveCommand {
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
