package com.woi.goalsokr.domain.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * KeyResult domain entity - Pure POJO (no JPA annotations)
 *
 * Represents a measurable result that indicates success of an Objective (template).
 * Part of OKR structure: Life Domain → Goal → Objective → KeyResult → Initiative
 *
 * Business rules:
 * - objectiveId is required
 * - titleNl/En are required (with fallback logic)
 * - targetValue is required (measurable target)
 * - unit is required (e.g., "dagen", "uren", "euro", "percentage")
 * - orderIndex is required and unique within an objective
 */
public class KeyResult {
    private Long id;
    private Long objectiveId; // Required - FK to Objective
    private String titleNl;
    private String titleEn;
    private String descriptionNl;
    private String descriptionEn;
    private BigDecimal targetValue; // Required - target value (e.g., 30, 7, 100.00)
    private String unit; // Required - unit of measurement (e.g., "dagen", "uren", "euro", "percentage", "keren")
    private Integer orderIndex; // Order within the objective
    private String number; // Unique human-readable number (e.g., "KR-123")
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long createdByUserId; // NULL = template, user_id = custom

    // Public constructor for mappers (infrastructure layer)
    public KeyResult() {}

    /**
     * Factory method: Create a new key result
     *
     * @param objectiveId Objective ID (required)
     * @param titleNl Dutch title (can be null)
     * @param titleEn English title (can be null)
     * @param targetValue Target value (required, must be positive)
     * @param unit Unit of measurement (required, e.g., "dagen", "uren", "euro")
     * @param orderIndex Order index within the objective (required)
     * @return New KeyResult instance
     * @throws IllegalArgumentException if required fields are null or invalid
     */
    public static KeyResult create(Long objectiveId, String titleNl, String titleEn, 
                                   BigDecimal targetValue, String unit, Integer orderIndex) {
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

        KeyResult keyResult = new KeyResult();
        keyResult.objectiveId = objectiveId;
        keyResult.titleNl = (titleNl != null && !titleNl.trim().isEmpty()) ? titleNl : titleEn;
        keyResult.titleEn = (titleEn != null && !titleEn.trim().isEmpty()) ? titleEn : titleNl;
        keyResult.targetValue = targetValue;
        keyResult.unit = unit.trim();
        keyResult.orderIndex = orderIndex;
        keyResult.createdAt = LocalDateTime.now();
        keyResult.updatedAt = LocalDateTime.now();
        return keyResult;
    }

    /**
     * Factory method: Create a custom key result (user-created)
     */
    public static KeyResult createCustom(Long objectiveId, Long createdByUserId, String title,
            String description, BigDecimal targetValue, String unit, Integer orderIndex) {
        if (objectiveId == null) {
            throw new IllegalArgumentException("Objective ID cannot be null");
        }
        if (createdByUserId == null) {
            throw new IllegalArgumentException("Created by user ID cannot be null");
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
        if (orderIndex == null || orderIndex < 1) {
            throw new IllegalArgumentException("Order index must be a positive integer");
        }

        KeyResult keyResult = new KeyResult();
        keyResult.objectiveId = objectiveId;
        keyResult.titleNl = title.trim();
        keyResult.titleEn = title.trim();
        keyResult.descriptionNl = description;
        keyResult.descriptionEn = description;
        keyResult.targetValue = targetValue;
        keyResult.unit = unit.trim();
        keyResult.orderIndex = orderIndex;
        keyResult.createdAt = LocalDateTime.now();
        keyResult.updatedAt = LocalDateTime.now();
        keyResult.createdByUserId = createdByUserId;
        return keyResult;
    }

    /**
     * Check if target is completed based on current value
     *
     * @param currentValue Current progress value
     * @return true if currentValue >= targetValue
     */
    public boolean isCompleted(BigDecimal currentValue) {
        if (currentValue == null) {
            return false;
        }
        return currentValue.compareTo(targetValue) >= 0;
    }

    /**
     * Calculate progress percentage
     *
     * @param currentValue Current progress value
     * @return Progress percentage (0-100), or 0 if currentValue is null
     */
    public BigDecimal getProgressPercentage(BigDecimal currentValue) {
        if (currentValue == null || targetValue == null || targetValue.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return currentValue.divide(targetValue, 2, BigDecimal.ROUND_HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .min(BigDecimal.valueOf(100)); // Cap at 100%
    }

    /**
     * Get title with fallback logic
     */
    public String getTitle(String language) {
        if ("nl".equals(language)) {
            return titleNl != null ? titleNl : titleEn;
        }
        return titleEn != null ? titleEn : titleNl;
    }

    // Getters
    public Long getId() { return id; }
    public Long getObjectiveId() { return objectiveId; }
    public String getTitleNl() { return titleNl; }
    public String getTitleEn() { return titleEn; }
    public String getDescriptionNl() { return descriptionNl; }
    public String getDescriptionEn() { return descriptionEn; }
    public BigDecimal getTargetValue() { return targetValue; }
    public String getUnit() { return unit; }
    public Integer getOrderIndex() { return orderIndex; }
    public String getNumber() { return number; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public Long getCreatedByUserId() { return createdByUserId; }

    // Setters for entity mapping (infrastructure layer only)
    public void setId(Long id) { this.id = id; }
    public void setObjectiveId(Long objectiveId) { this.objectiveId = objectiveId; }
    public void setTitleNl(String titleNl) { this.titleNl = titleNl; }
    public void setTitleEn(String titleEn) { this.titleEn = titleEn; }
    public void setDescriptionNl(String descriptionNl) { this.descriptionNl = descriptionNl; }
    public void setDescriptionEn(String descriptionEn) { this.descriptionEn = descriptionEn; }
    public void setTargetValue(BigDecimal targetValue) { this.targetValue = targetValue; }
    public void setUnit(String unit) { this.unit = unit; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
    public void setNumber(String number) { this.number = number; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public void setCreatedByUserId(Long createdByUserId) { this.createdByUserId = createdByUserId; }
}
