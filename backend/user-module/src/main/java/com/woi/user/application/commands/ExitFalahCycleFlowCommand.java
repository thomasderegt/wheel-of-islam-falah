package com.woi.user.application.commands;

/**
 * Command for exiting the Falah cycle creation flow (Finish) - cycle stays active
 */
public record ExitFalahCycleFlowCommand(Long userId, Long cycleId) {
    public ExitFalahCycleFlowCommand {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (cycleId == null) {
            throw new IllegalArgumentException("Cycle ID cannot be null");
        }
    }
}
