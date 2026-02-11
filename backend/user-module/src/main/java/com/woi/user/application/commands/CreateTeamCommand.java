package com.woi.user.application.commands;

/**
 * Command for creating a new team
 */
public record CreateTeamCommand(
    String name,
    String description,
    Long ownerId
) {
    public CreateTeamCommand {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Team name cannot be null or empty");
        }
        if (ownerId == null) {
            throw new IllegalArgumentException("Owner ID cannot be null");
        }
    }
}
