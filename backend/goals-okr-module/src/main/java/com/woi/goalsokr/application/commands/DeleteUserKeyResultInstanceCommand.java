package com.woi.goalsokr.application.commands;

/**
 * Command to delete a user key result instance (and its children, kanban items).
 */
public record DeleteUserKeyResultInstanceCommand(Long userKeyResultInstanceId) {
    public DeleteUserKeyResultInstanceCommand {
        if (userKeyResultInstanceId == null) {
            throw new IllegalArgumentException("userKeyResultInstanceId cannot be null");
        }
    }
}
