package com.woi.goalsokr.api;

import java.time.LocalDateTime;

/**
 * Summary DTO for UserKeyResultInstance
 * Used in public API interface
 */
public record UserKeyResultInstanceSummary(
    Long id,
    Long userObjectiveInstanceId,
    Long keyResultId,
    LocalDateTime startedAt,
    LocalDateTime completedAt
) {}
