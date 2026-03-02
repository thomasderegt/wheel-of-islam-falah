package com.woi.user.application.commands;

/**
 * Command for completing a Falah growth cycle
 */
public record CompleteFalahCycleCommand(Long userId, Long cycleId) {
    public CompleteFalahCycleCommand {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (cycleId == null) {
            throw new IllegalArgumentException("Cycle ID cannot be null");
        }
    }
}
