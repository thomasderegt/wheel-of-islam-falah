package com.woi.goalsokr.application.commands;

/**
 * Command to delete a key result (only allowed when no user has started it).
 */
public record DeleteKeyResultCommand(
    Long keyResultId
) {
    public DeleteKeyResultCommand {
        if (keyResultId == null || keyResultId <= 0) {
            throw new IllegalArgumentException("Key result ID must be a positive integer");
        }
    }
}
