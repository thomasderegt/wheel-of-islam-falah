package com.woi.goalsokr.api;

import java.time.LocalDateTime;

/**
 * Summary DTO for Goal
 * Used in public API interface
 */
public record GoalSummary(
    Long id,
    Long lifeDomainId,
    String titleNl,
    String titleEn,
    String descriptionNl,
    String descriptionEn,
    Integer orderIndex,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
