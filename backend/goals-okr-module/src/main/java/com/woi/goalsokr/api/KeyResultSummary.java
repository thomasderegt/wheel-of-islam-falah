package com.woi.goalsokr.api;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Summary DTO for KeyResult
 * Used in public API interface
 */
public record KeyResultSummary(
    Long id,
    Long objectiveId,
    String titleNl,
    String titleEn,
    String descriptionNl,
    String descriptionEn,
    BigDecimal targetValue,
    String unit,
    Integer orderIndex,
    String number,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
