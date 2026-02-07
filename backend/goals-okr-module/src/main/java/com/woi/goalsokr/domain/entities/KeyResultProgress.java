package com.woi.goalsokr.domain.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * KeyResultProgress domain entity - Pure POJO (no JPA annotations)
 *
 * Represents progress tracking for a Key Result (user-specific).
 * Tracks current value against target value.
 *
 * Business rules:
 * - keyResultId is required (reference to template)
 * - userKeyResultInstanceId is required (reference to user's key result instance)
 * - currentValue can be null (no progress yet) or >= 0
 * - userId is accessed via UserKeyResultInstance → UserObjectiveInstance → UserGoalInstance (strikt DDD)
 */
public class KeyResultProgress {
    private Long id;
    private Long keyResultId; // Required - FK to KeyResult (template)
    private Long userKeyResultInstanceId; // Required - FK to UserKeyResultInstance
    private BigDecimal currentValue; // Current progress value (can be null, must be >= 0 if set)
    private LocalDateTime updatedAt;

    // Public constructor for mappers (infrastructure layer)
    public KeyResultProgress() {}

    /**
     * Factory method: Create a new key result progress
     *
     * @param keyResultId Key Result ID (required)
     * @param userKeyResultInstanceId User Key Result Instance ID (required)
     * @param currentValue Current progress value (can be null, must be >= 0 if set)
     * @return New KeyResultProgress instance
     * @throws IllegalArgumentException if required fields are null or currentValue is negative
     */
    public static KeyResultProgress create(Long keyResultId, Long userKeyResultInstanceId, BigDecimal currentValue) {
        if (keyResultId == null) {
            throw new IllegalArgumentException("Key Result ID cannot be null");
        }
        if (userKeyResultInstanceId == null) {
            throw new IllegalArgumentException("User Key Result Instance ID cannot be null");
        }
        if (currentValue != null && currentValue.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Current value cannot be negative");
        }

        KeyResultProgress progress = new KeyResultProgress();
        progress.keyResultId = keyResultId;
        progress.userKeyResultInstanceId = userKeyResultInstanceId;
        progress.currentValue = currentValue;
        progress.updatedAt = LocalDateTime.now();
        return progress;
    }

    /**
     * Update progress value
     *
     * @param newValue New progress value (can be null, must be >= 0 if set)
     * @throws IllegalArgumentException if newValue is negative
     */
    public void updateProgress(BigDecimal newValue) {
        if (newValue != null && newValue.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Current value cannot be negative");
        }
        this.currentValue = newValue;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Calculate progress percentage based on KeyResult target
     *
     * @param keyResult KeyResult entity with targetValue
     * @return Progress percentage (0-100), or 0 if currentValue is null or keyResult is null
     */
    public BigDecimal getProgressPercentage(KeyResult keyResult) {
        if (keyResult == null || currentValue == null || keyResult.getTargetValue() == null) {
            return BigDecimal.ZERO;
        }
        if (keyResult.getTargetValue().compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return currentValue.divide(keyResult.getTargetValue(), 2, BigDecimal.ROUND_HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .min(BigDecimal.valueOf(100)); // Cap at 100%
    }

    // Getters
    public Long getId() { return id; }
    public Long getKeyResultId() { return keyResultId; }
    public Long getUserKeyResultInstanceId() { return userKeyResultInstanceId; }
    public BigDecimal getCurrentValue() { return currentValue; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // Setters for entity mapping (infrastructure layer only)
    public void setId(Long id) { this.id = id; }
    public void setKeyResultId(Long keyResultId) { this.keyResultId = keyResultId; }
    public void setUserKeyResultInstanceId(Long userKeyResultInstanceId) { this.userKeyResultInstanceId = userKeyResultInstanceId; }
    /**
     * Setter for currentValue - ONLY for entity mapping (infrastructure layer)
     * Validates that currentValue is >= 0 if not null (business invariant)
     * 
     * @param currentValue Current progress value (can be null, must be >= 0 if set)
     * @throws IllegalArgumentException if currentValue is negative
     */
    public void setCurrentValue(BigDecimal currentValue) {
        if (currentValue != null && currentValue.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Current value cannot be negative");
        }
        this.currentValue = currentValue;
    }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
