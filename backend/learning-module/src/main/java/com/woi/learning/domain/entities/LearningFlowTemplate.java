package com.woi.learning.domain.entities;

import java.time.LocalDateTime;

/**
 * LearningFlowTemplate domain entity - Pure POJO (no JPA annotations)
 * 
 * Represents an admin-designed learning flow template for a section.
 * Each template belongs to exactly one section.
 * Admins can create multiple templates per section.
 * 
 * Business rules:
 * - sectionId is required
 * - name is required
 * - createdBy is required
 */
public class LearningFlowTemplate {
    private Long id;
    private String name;
    private String description;
    private Long sectionId; // Required - soft reference to content.sections
    private Long createdBy; // Required - soft reference to users.users
    private LocalDateTime createdAt;
    
    // Public constructor for mappers (infrastructure layer)
    public LearningFlowTemplate() {}
    
    /**
     * Factory method: Create a new learning flow template
     * 
     * @param name Template name (required)
     * @param description Template description (optional)
     * @param sectionId Section ID (required)
     * @param createdBy User ID who created this template (required)
     * @return New LearningFlowTemplate instance
     * @throws IllegalArgumentException if required fields are null or empty
     */
    public static LearningFlowTemplate create(String name, String description, Long sectionId, Long createdBy) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be null or empty");
        }
        if (sectionId == null) {
            throw new IllegalArgumentException("SectionId cannot be null");
        }
        if (createdBy == null) {
            throw new IllegalArgumentException("CreatedBy cannot be null");
        }
        
        LearningFlowTemplate template = new LearningFlowTemplate();
        template.name = name;
        template.description = description;
        template.sectionId = sectionId;
        template.createdBy = createdBy;
        template.createdAt = LocalDateTime.now();
        return template;
    }
    
    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public Long getSectionId() { return sectionId; }
    public Long getCreatedBy() { return createdBy; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    
    // Setters for entity mapping (infrastructure layer only)
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setSectionId(Long sectionId) { this.sectionId = sectionId; }
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

