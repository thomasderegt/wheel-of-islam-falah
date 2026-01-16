package com.woi.learning.domain.entities;

import java.time.LocalDateTime;

/**
 * LearningFlowEnrollment domain entity - Pure POJO (no JPA annotations)
 * 
 * Represents a user-specific instance of a learning flow.
 * Created when a user starts a template flow from a section.
 * 
 * Business rules:
 * - userId is required
 * - templateId is required
 * - sectionId is required (must match template.sectionId - validated in application layer)
 * - A user can start the same template multiple times (cyclical learning)
 */
public class LearningFlowEnrollment {
    private Long id;
    private Long userId; // Required - soft reference to users.users
    private Long templateId; // Required - FK to LearningFlowTemplate
    private Long sectionId; // Required - soft reference to content.sections (must match template.sectionId)
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    
    // Public constructor for mappers (infrastructure layer)
    public LearningFlowEnrollment() {}
    
    /**
     * Factory method: Start a new enrollment
     * 
     * @param userId User ID (required)
     * @param templateId Template ID (required)
     * @param sectionId Section ID (required, must match template.sectionId)
     * @return New LearningFlowEnrollment instance
     * @throws IllegalArgumentException if required fields are null
     */
    public static LearningFlowEnrollment start(Long userId, Long templateId, Long sectionId) {
        if (userId == null) {
            throw new IllegalArgumentException("UserId cannot be null");
        }
        if (templateId == null) {
            throw new IllegalArgumentException("TemplateId cannot be null");
        }
        if (sectionId == null) {
            throw new IllegalArgumentException("SectionId cannot be null");
        }
        
        LearningFlowEnrollment enrollment = new LearningFlowEnrollment();
        enrollment.userId = userId;
        enrollment.templateId = templateId;
        enrollment.sectionId = sectionId;
        enrollment.startedAt = LocalDateTime.now();
        return enrollment;
    }
    
    /**
     * Mark this enrollment as completed
     * 
     * @throws IllegalStateException if enrollment is already completed
     */
    public void markCompleted() {
        if (this.completedAt != null) {
            throw new IllegalStateException("Enrollment is already completed");
        }
        this.completedAt = LocalDateTime.now();
    }
    
    /**
     * Check if enrollment is completed
     * 
     * @return true if completed, false otherwise
     */
    public boolean isCompleted() {
        return completedAt != null;
    }
    
    // Getters
    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public Long getTemplateId() { return templateId; }
    public Long getSectionId() { return sectionId; }
    public LocalDateTime getStartedAt() { return startedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    
    // Setters for entity mapping (infrastructure layer only)
    public void setId(Long id) { this.id = id; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setTemplateId(Long templateId) { this.templateId = templateId; }
    public void setSectionId(Long sectionId) { this.sectionId = sectionId; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}

