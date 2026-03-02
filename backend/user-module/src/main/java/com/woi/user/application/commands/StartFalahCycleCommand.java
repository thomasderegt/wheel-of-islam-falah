package com.woi.user.application.commands;

/**
 * Command for starting a new Falah growth cycle
 */
public record StartFalahCycleCommand(Long userId) {
    public StartFalahCycleCommand {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
    }
}
