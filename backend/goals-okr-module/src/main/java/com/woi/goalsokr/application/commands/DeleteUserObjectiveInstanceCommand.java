package com.woi.goalsokr.application.commands;

/**
 * Command to delete a user objective instance (and its children, kanban items).
 */
public record DeleteUserObjectiveInstanceCommand(Long userObjectiveInstanceId) {
    public DeleteUserObjectiveInstanceCommand {
        if (userObjectiveInstanceId == null) {
            throw new IllegalArgumentException("userObjectiveInstanceId cannot be null");
        }
    }
}
