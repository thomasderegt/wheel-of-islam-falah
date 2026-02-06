package com.woi.goalsokr.application.commands;

import java.math.BigDecimal;

/**
 * Command to create a new key result (template)
 */
public record CreateKeyResultCommand(
    Long objectiveId,
    String titleNl,
    String titleEn,
    String descriptionNl,
    String descriptionEn,
    BigDecimal targetValue,
    String unit,
    Integer orderIndex
) {
    public CreateKeyResultCommand {
        if (objectiveId == null) {
            throw new IllegalArgumentException("Objective ID cannot be null");
        }
        if ((titleNl == null || titleNl.trim().isEmpty()) && 
            (titleEn == null || titleEn.trim().isEmpty())) {
            throw new IllegalArgumentException("At least one title (titleNl or titleEn) must be provided");
        }
        if (targetValue == null || targetValue.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Target value must be a positive number");
        }
        if (unit == null || unit.trim().isEmpty()) {
            throw new IllegalArgumentException("Unit cannot be null or empty");
        }
        if (orderIndex == null || orderIndex < 1) {
            throw new IllegalArgumentException("Order index must be a positive integer");
        }
    }
}
