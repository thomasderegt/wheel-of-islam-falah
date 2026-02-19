package com.woi.goalsokr.domain.entities;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Initiative domain entity - Pure POJO (no JPA annotations)
 *
 * Represents an initiative (template or custom).
 * - Template: createdByUserId = null
 * - Custom: createdByUserId = user who created it
 *
 * Business rules:
 * - keyResultId is required (reference to template)
 * - titleNl/En are required (with fallback logic)
 * - displayOrder is required for sorting
 */
public class Initiative {
    private Long id;
    private Long keyResultId; // Required - FK to KeyResult (template)
    private String titleNl;
    private String titleEn;
    private String descriptionNl;
    private String descriptionEn;
    private Long learningFlowTemplateId; // Optional - Soft reference to learning.learning_flow_templates
    private Integer displayOrder;
    private String number; // Unique human-readable number (e.g., "INIT-123")
    private LocalDateTime createdAt;
    private Long createdByUserId; // NULL = template, user_id = custom
    private LocalDate targetDate;
    private String status; // ACTIVE, COMPLETED, ARCHIVED (mainly for custom)
    private LocalDateTime updatedAt;
    private LocalDateTime completedAt;
    private Long learningFlowEnrollmentId; // Optional - for custom initiatives

    // Public constructor for mappers (infrastructure layer)
    public Initiative() {}

    /**
     * Factory method: Create a new initiative template
     */
    public static Initiative create(Long keyResultId, String titleNl, String titleEn, Integer displayOrder) {
        if (keyResultId == null) {
            throw new IllegalArgumentException("Key Result ID cannot be null");
        }
        if ((titleNl == null || titleNl.trim().isEmpty()) &&
            (titleEn == null || titleEn.trim().isEmpty())) {
            throw new IllegalArgumentException("At least one title (titleNl or titleEn) must be provided");
        }
        if (displayOrder == null || displayOrder < 1) {
            throw new IllegalArgumentException("Display order must be a positive integer");
        }

        Initiative initiative = new Initiative();
        initiative.keyResultId = keyResultId;
        initiative.titleNl = (titleNl != null && !titleNl.trim().isEmpty()) ? titleNl : titleEn;
        initiative.titleEn = (titleEn != null && !titleEn.trim().isEmpty()) ? titleEn : titleNl;
        initiative.displayOrder = displayOrder;
        initiative.createdAt = LocalDateTime.now();
        initiative.updatedAt = LocalDateTime.now();
        return initiative;
    }

    /**
     * Factory method: Create a custom initiative (user-created)
     */
    public static Initiative createCustom(Long keyResultId, Long createdByUserId, String title,
            String description, LocalDate targetDate, Integer displayOrder) {
        if (keyResultId == null) {
            throw new IllegalArgumentException("Key Result ID cannot be null");
        }
        if (createdByUserId == null) {
            throw new IllegalArgumentException("Created by user ID cannot be null");
        }
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Title cannot be null or empty");
        }
        if (displayOrder == null || displayOrder < 1) {
            throw new IllegalArgumentException("Display order must be a positive integer");
        }

        Initiative initiative = new Initiative();
        initiative.keyResultId = keyResultId;
        initiative.titleNl = title.trim();
        initiative.titleEn = title.trim();
        initiative.descriptionNl = description;
        initiative.descriptionEn = description;
        initiative.displayOrder = displayOrder;
        initiative.createdAt = LocalDateTime.now();
        initiative.updatedAt = LocalDateTime.now();
        initiative.createdByUserId = createdByUserId;
        initiative.targetDate = targetDate;
        initiative.status = "ACTIVE";
        return initiative;
    }

    /**
     * Link initiative to a learning flow enrollment (for custom initiatives)
     */
    public void linkLearningFlowEnrollment(Long learningFlowEnrollmentId) {
        this.learningFlowEnrollmentId = learningFlowEnrollmentId;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Update title (for custom initiatives)
     */
    public void updateTitle(String title) {
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Title cannot be null or empty");
        }
        this.titleNl = title.trim();
        this.titleEn = title.trim();
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Update description (for custom initiatives)
     */
    public void updateDescription(String description) {
        this.descriptionNl = description;
        this.descriptionEn = description;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Update target date (for custom initiatives)
     */
    public void updateTargetDate(LocalDate targetDate) {
        this.targetDate = targetDate;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Mark initiative as completed (for custom initiatives)
     */
    public void complete() {
        if (this.completedAt != null) {
            throw new IllegalStateException("Initiative is already completed");
        }
        this.status = "COMPLETED";
        this.completedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
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
    public Long getKeyResultId() { return keyResultId; }
    public String getTitleNl() { return titleNl; }
    public String getTitleEn() { return titleEn; }
    public String getDescriptionNl() { return descriptionNl; }
    public String getDescriptionEn() { return descriptionEn; }
    public Long getLearningFlowTemplateId() { return learningFlowTemplateId; }
    public Integer getDisplayOrder() { return displayOrder; }
    public String getNumber() { return number; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public Long getCreatedByUserId() { return createdByUserId; }
    public LocalDate getTargetDate() { return targetDate; }
    public String getStatus() { return status; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public Long getLearningFlowEnrollmentId() { return learningFlowEnrollmentId; }

    // Setters for entity mapping (infrastructure layer only)
    public void setId(Long id) { this.id = id; }
    public void setKeyResultId(Long keyResultId) { this.keyResultId = keyResultId; }
    public void setTitleNl(String titleNl) { this.titleNl = titleNl; }
    public void setTitleEn(String titleEn) { this.titleEn = titleEn; }
    public void setDescriptionNl(String descriptionNl) { this.descriptionNl = descriptionNl; }
    public void setDescriptionEn(String descriptionEn) { this.descriptionEn = descriptionEn; }
    public void setLearningFlowTemplateId(Long learningFlowTemplateId) { this.learningFlowTemplateId = learningFlowTemplateId; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
    public void setNumber(String number) { this.number = number; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setCreatedByUserId(Long createdByUserId) { this.createdByUserId = createdByUserId; }
    public void setTargetDate(LocalDate targetDate) { this.targetDate = targetDate; }
    public void setStatus(String status) { this.status = status; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    public void setLearningFlowEnrollmentId(Long learningFlowEnrollmentId) { this.learningFlowEnrollmentId = learningFlowEnrollmentId; }
}
