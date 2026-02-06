package com.woi.goalsokr.api;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Summary DTO for KeyResultProgress
 * Used in public API interface
 */
public record KeyResultProgressSummary(
    Long id,
    Long keyResultId,
    Long userObjectiveInstanceId,
    BigDecimal currentValue,
    LocalDateTime updatedAt
) {}
