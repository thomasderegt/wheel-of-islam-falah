package com.woi.goalsokr.domain.entities;

import java.time.LocalDateTime;

/**
 * InitiativeSuggestion domain entity - Pure POJO (no JPA annotations)
 *
 * Represents a suggested initiative for a Key Result (template).
 * Users can use these suggestions as starting points when creating their own initiatives.
 *
 * Business rules:
 * - keyResultId is required (reference to template)
 * - titleNl/En are required (with fallback logic)
 * - learningFlowTemplateId is optional (soft reference to learning flow template)
 * - displayOrder is required for sorting
 */
public class InitiativeSuggestion {
    private Long id;
    private Long keyResultId; // Required - FK to KeyResult (template)
    private String titleNl;
    private String titleEn;
    private String descriptionNl;
    private String descriptionEn;
    private Long learningFlowTemplateId; // Optional - Soft reference to learning.learning_flow_templates
    private Integer displayOrder;
    private LocalDateTime createdAt;

    // Public constructor for mappers (infrastructure layer)
    public InitiativeSuggestion() {}

    // Getters
    public Long getId() { return id; }
    public Long getKeyResultId() { return keyResultId; }
    public String getTitleNl() { return titleNl; }
    public String getTitleEn() { return titleEn; }
    public String getDescriptionNl() { return descriptionNl; }
    public String getDescriptionEn() { return descriptionEn; }
    public Long getLearningFlowTemplateId() { return learningFlowTemplateId; }
    public Integer getDisplayOrder() { return displayOrder; }
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
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
