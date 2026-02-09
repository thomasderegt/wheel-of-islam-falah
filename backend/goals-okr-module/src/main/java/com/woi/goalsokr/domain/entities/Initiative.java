package com.woi.goalsokr.domain.entities;

import java.time.LocalDateTime;

/**
 * Initiative domain entity - Pure POJO (no JPA annotations)
 *
 * Represents an initiative template for a Key Result (template).
 * Part of OKR structure: Life Domain → Goal → Objective → KeyResult → Initiative
 *
 * Business rules:
 * - keyResultId is required (reference to template)
 * - titleNl/En are required (with fallback logic)
 * - learningFlowTemplateId is optional (soft reference to learning flow template)
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

    // Public constructor for mappers (infrastructure layer)
    public Initiative() {}

    /**
     * Factory method: Create a new initiative template
     *
     * @param keyResultId Key Result ID (required)
     * @param titleNl Dutch title (can be null)
     * @param titleEn English title (can be null)
     * @param displayOrder Display order within the key result (required)
     * @return New Initiative instance
     * @throws IllegalArgumentException if required fields are null or invalid
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
        return initiative;
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
}
