package com.woi.goalsokr.api;

import java.time.LocalDateTime;

/**
 * Summary DTO for UserGoalInstance
 * Used in public API interface
 */
public record UserGoalInstanceSummary(
    Long id,
    Long userId,
    Long goalId,
    String number,
    LocalDateTime startedAt,
    LocalDateTime completedAt
) {}
