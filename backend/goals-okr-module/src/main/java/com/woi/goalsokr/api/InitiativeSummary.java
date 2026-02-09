package com.woi.goalsokr.api;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Summary DTO for Initiative
 * Used in public API interface
 */
public record InitiativeSummary(
    Long id,
    Long keyResultId,
    Long userObjectiveInstanceId,
    String title,
    String description,
    String status, // ACTIVE, COMPLETED, ARCHIVED
    LocalDate targetDate,
    String number,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
