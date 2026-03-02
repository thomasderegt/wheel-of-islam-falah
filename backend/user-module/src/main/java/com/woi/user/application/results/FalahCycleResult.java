package com.woi.user.application.results;

import com.woi.user.domain.entities.FalahCycle;

import java.time.LocalDateTime;

/**
 * Result DTO for Falah cycle operations
 */
public record FalahCycleResult(
    Long id,
    Long userId,
    LocalDateTime startedAt,
    LocalDateTime flowExitedAt,
    LocalDateTime completedAt,
    boolean active,
    boolean flowExited
) {
    public static FalahCycleResult from(FalahCycle cycle) {
        return new FalahCycleResult(
            cycle.getId(),
            cycle.getUserId(),
            cycle.getStartedAt(),
            cycle.getFlowExitedAt(),
            cycle.getCompletedAt(),
            cycle.isActive(),
            cycle.isFlowExited()
        );
    }
}
