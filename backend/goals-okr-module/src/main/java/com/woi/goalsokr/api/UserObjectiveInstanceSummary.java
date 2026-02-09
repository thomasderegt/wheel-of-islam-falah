package com.woi.goalsokr.api;

import java.time.LocalDateTime;

/**
 * Summary DTO for UserObjectiveInstance
 * Used in public API interface
 */
public record UserObjectiveInstanceSummary(
    Long id,
    Long userGoalInstanceId,
    Long objectiveId,
    String number,
    LocalDateTime startedAt,
    LocalDateTime completedAt
) {}
