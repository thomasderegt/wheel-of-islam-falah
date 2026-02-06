package com.woi.goalsokr.application.commands;

import java.math.BigDecimal;

/**
 * Command to update key result progress
 */
public record UpdateKeyResultProgressCommand(
    Long userId,
    Long keyResultId,
    Long userObjectiveInstanceId,
    BigDecimal currentValue
) {
    public UpdateKeyResultProgressCommand {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (keyResultId == null) {
            throw new IllegalArgumentException("Key Result ID cannot be null");
        }
        if (userObjectiveInstanceId == null) {
            throw new IllegalArgumentException("User Objective Instance ID cannot be null");
        }
        if (currentValue != null && currentValue.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Current value cannot be negative");
        }
    }
}
