package com.woi.goalsokr.application.commands;

import java.math.BigDecimal;

/**
 * Command to create a custom key result (KeyResult template + UserKeyResultInstance + Kanban item)
 */
public record CreateCustomKeyResultCommand(
    Long userId,
    Long userObjectiveInstanceId,
    String title,
    String description,
    BigDecimal targetValue,
    String unit
) {
    public CreateCustomKeyResultCommand {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (userObjectiveInstanceId == null) {
            throw new IllegalArgumentException("User Objective Instance ID cannot be null");
        }
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Title cannot be null or empty");
        }
        if (targetValue == null || targetValue.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Target value must be a positive number");
        }
        if (unit == null || unit.trim().isEmpty()) {
            throw new IllegalArgumentException("Unit cannot be null or empty");
        }
    }
}
