package com.woi.goalsokr.application.commands;

import java.math.BigDecimal;

/**
 * Command to create a new user-specific key result
 */
public record CreateUserKeyResultCommand(
    Long userId,
    Long userObjectiveId,
    String title,
    String description, // Optional
    BigDecimal targetValue, // Optional
    String unit // Optional
) {
    public CreateUserKeyResultCommand {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (userObjectiveId == null) {
            throw new IllegalArgumentException("User Objective ID cannot be null");
        }
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Title cannot be null or empty");
        }
        if (targetValue != null && targetValue.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Target value must be positive if provided");
        }
    }
}
