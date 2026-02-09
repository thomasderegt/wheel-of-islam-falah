package com.woi.goalsokr.domain.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * UserKeyResult domain entity - Pure POJO (no JPA annotations)
 *
 * Represents a user-specific key result created by an end user (not based on templates).
 * Belongs to a UserObjective and tracks progress with optional target values.
 *
 * Business rules:
 * - userId is required
 * - userObjectiveId is required (FK to UserObjective)
 * - title is required and cannot be empty
 * - targetValue is optional but must be positive if set
 * - currentValue defaults to 0 and must be >= 0
 * - completedAt can be set to mark key result as completed
 */
public class UserKeyResult {
    private Long id;
    private Long userId; // Required - Soft reference to users.users
    private Long userObjectiveId; // Required - FK to UserObjective
    private String title; // Required
    private String description; // Optional
    private BigDecimal targetValue; // Optional - Target value for tracking
    private String unit; // Optional - Unit of measurement (e.g., "dagen", "uren", "euro")
    private BigDecimal currentValue; // Current progress value (defaults to 0)
    private String number; // Unique human-readable number (e.g., "MY-KR-123")
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime completedAt;

    // Public constructor for mappers (infrastructure layer)
    public UserKeyResult() {}

    /**
     * Factory method: Create a new user-specific key result
     *
     * @param userId User ID (required)
     * @param userObjectiveId User Objective ID (required)
     * @param title Key result title (required)
     * @return New UserKeyResult instance with currentValue = 0
     * @throws IllegalArgumentException if required fields are null or invalid
     */
    public static UserKeyResult create(Long userId, Long userObjectiveId, String title) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (userObjectiveId == null) {
            throw new IllegalArgumentException("User Objective ID cannot be null");
        }
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Title cannot be null or empty");
        }

        UserKeyResult keyResult = new UserKeyResult();
        keyResult.userId = userId;
        keyResult.userObjectiveId = userObjectiveId;
        keyResult.title = title.trim();
        keyResult.currentValue = BigDecimal.ZERO;
        keyResult.createdAt = LocalDateTime.now();
        keyResult.updatedAt = LocalDateTime.now();
        keyResult.completedAt = null;
        return keyResult;
    }

    /**
     * Update key result title
     *
     * @param title New title
     * @throws IllegalArgumentException if title is null or empty
     */
    public void updateTitle(String title) {
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Title cannot be null or empty");
        }
        this.title = title.trim();
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Update key result description
     */
    public void updateDescription(String description) {
        this.description = description;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Set target value and unit
     *
     * @param targetValue Target value (must be positive)
     * @param unit Unit of measurement
     * @throws IllegalArgumentException if targetValue is not positive
     */
    public void setTarget(BigDecimal targetValue, String unit) {
        if (targetValue != null && targetValue.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Target value must be positive");
        }
        this.targetValue = targetValue;
        this.unit = unit;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Update current progress value
     *
     * @param currentValue New current value (must be >= 0)
     * @throws IllegalArgumentException if currentValue is negative
     */
    public void updateProgress(BigDecimal currentValue) {
        if (currentValue == null) {
            throw new IllegalArgumentException("Current value cannot be null");
        }
        if (currentValue.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Current value cannot be negative");
        }
        this.currentValue = currentValue;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Get progress percentage (0-100)
     * Returns null if no target value is set
     */
    public BigDecimal getProgressPercentage() {
        if (targetValue == null || targetValue.compareTo(BigDecimal.ZERO) == 0) {
            return null;
        }
        if (currentValue == null) {
            return BigDecimal.ZERO;
        }
        BigDecimal percentage = currentValue
            .divide(targetValue, 4, java.math.RoundingMode.HALF_UP)
            .multiply(new BigDecimal("100"));
        return percentage.min(new BigDecimal("100")); // Cap at 100%
    }

    /**
     * Check if key result is completed (reached target)
     */
    public boolean isTargetReached() {
        if (targetValue == null || currentValue == null) {
            return false;
        }
        return currentValue.compareTo(targetValue) >= 0;
    }

    /**
     * Mark key result as completed
     */
    public void complete() {
        if (this.completedAt != null) {
            throw new IllegalStateException("Key result is already completed");
        }
        this.completedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Reopen a completed key result
     */
    public void reopen() {
        this.completedAt = null;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Check if key result is completed
     */
    public boolean isCompleted() {
        return completedAt != null;
    }

    // Getters
    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public Long getUserObjectiveId() { return userObjectiveId; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public BigDecimal getTargetValue() { return targetValue; }
    public String getUnit() { return unit; }
    public BigDecimal getCurrentValue() { return currentValue; }
    public String getNumber() { return number; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }

    // Setters for entity mapping (infrastructure layer only)
    public void setId(Long id) { this.id = id; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setUserObjectiveId(Long userObjectiveId) { this.userObjectiveId = userObjectiveId; }
    /**
     * Setter for title - ONLY for entity mapping (infrastructure layer)
     * Validates that title is not null or empty (business invariant)
     * 
     * @param title Key result title (required)
     * @throws IllegalArgumentException if title is null or empty
     */
    public void setTitle(String title) {
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Title cannot be null or empty");
        }
        this.title = title.trim();
    }
    public void setDescription(String description) { this.description = description; }
    /**
     * Setter for targetValue - ONLY for entity mapping (infrastructure layer)
     * Validates that targetValue is positive if not null (business invariant)
     * 
     * @param targetValue Target value (optional, but must be positive if set)
     * @throws IllegalArgumentException if targetValue is not positive
     */
    public void setTargetValue(BigDecimal targetValue) {
        if (targetValue != null && targetValue.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Target value must be positive");
        }
        this.targetValue = targetValue;
    }
    public void setUnit(String unit) { this.unit = unit; }
    /**
     * Setter for currentValue - ONLY for entity mapping (infrastructure layer)
     * Validates that currentValue is >= 0 if not null (business invariant)
     * 
     * @param currentValue Current progress value (must be >= 0 if set)
     * @throws IllegalArgumentException if currentValue is negative
     */
    public void setCurrentValue(BigDecimal currentValue) {
        if (currentValue != null && currentValue.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Current value cannot be negative");
        }
        this.currentValue = currentValue;
    }
    public void setNumber(String number) { this.number = number; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
