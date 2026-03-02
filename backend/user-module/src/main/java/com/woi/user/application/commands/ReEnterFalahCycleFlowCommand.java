package com.woi.user.application.commands;

/**
 * Command for re-entering the Falah cycle creation flow (Continue)
 */
public record ReEnterFalahCycleFlowCommand(Long userId, Long cycleId) {
    public ReEnterFalahCycleFlowCommand {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (cycleId == null) {
            throw new IllegalArgumentException("Cycle ID cannot be null");
        }
    }
}
