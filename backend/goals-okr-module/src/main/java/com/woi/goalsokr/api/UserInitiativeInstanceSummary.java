package com.woi.goalsokr.api;

import java.time.LocalDateTime;

/**
 * Summary DTO for UserInitiativeInstance
 * Used in public API interface
 */
public record UserInitiativeInstanceSummary(
    Long id,
    Long userKeyResultInstanceId,
    Long initiativeId,
    String number,
    LocalDateTime startedAt,
    LocalDateTime completedAt
) {}
