package com.woi.goalsokr.api;

import java.time.LocalDateTime;

/**
 * Summary DTO for Objective
 * Used in public API interface
 */
public record ObjectiveSummary(
    Long id,
    Long goalId,
    String titleNl,
    String titleEn,
    String descriptionNl,
    String descriptionEn,
    Integer orderIndex,
    String number,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
