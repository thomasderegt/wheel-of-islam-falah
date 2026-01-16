package com.woi.learning.domain.entities;

import com.woi.learning.domain.enums.ProgressStatus;
import java.time.LocalDateTime;

/**
 * LearningFlowEnrollmentStepProgress domain entity - Pure POJO (no JPA annotations)
 * 
 * Represents the progress status of a step for a specific enrollment.
 * 
 * Business rules:
 * - enrollmentId is required
 * - stepId is required
 * - status is required (NOT_STARTED, IN_PROGRESS, COMPLETED)
 * - Unique per (enrollmentId, stepId) combination
 * - Progress is automatically set to IN_PROGRESS when first answer is added
 */
public class LearningFlowEnrollmentStepProgress {
    private Long id;
    private Long enrollmentId; // Required - FK to LearningFlowEnrollment
    private Long stepId; // Required - FK to LearningFlowStep
    private ProgressStatus status; // Required
    private LocalDateTime updatedAt;
    
    // Public constructor for mappers (infrastructure layer)
    public LearningFlowEnrollmentStepProgress() {}
    
    /**
     * Factory method: Create new progress with NOT_STARTED status
     * 
     * @param enrollmentId Enrollment ID (required)
     * @param stepId Step ID (required)
     * @return New LearningFlowEnrollmentStepProgress instance
     * @throws IllegalArgumentException if required fields are null
     */
    public static LearningFlowEnrollmentStepProgress create(Long enrollmentId, Long stepId) {
        if (enrollmentId == null) {
            throw new IllegalArgumentException("EnrollmentId cannot be null");
        }
        if (stepId == null) {
            throw new IllegalArgumentException("StepId cannot be null");
        }
        
        LearningFlowEnrollmentStepProgress progress = new LearningFlowEnrollmentStepProgress();
        progress.enrollmentId = enrollmentId;
        progress.stepId = stepId;
        progress.status = ProgressStatus.NOT_STARTED;
        progress.updatedAt = LocalDateTime.now();
        return progress;
    }
    
    /**
     * Mark progress as IN_PROGRESS
     * 
     * @throws IllegalStateException if progress is already COMPLETED
     */
    public void markInProgress() {
        if (this.status == ProgressStatus.COMPLETED) {
            throw new IllegalStateException("Cannot mark completed progress as in progress");
        }
        this.status = ProgressStatus.IN_PROGRESS;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Mark progress as COMPLETED
     */
    public void markCompleted() {
        this.status = ProgressStatus.COMPLETED;
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters
    public Long getId() { return id; }
    public Long getEnrollmentId() { return enrollmentId; }
    public Long getStepId() { return stepId; }
    public ProgressStatus getStatus() { return status; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    
    // Setters for entity mapping (infrastructure layer only)
    public void setId(Long id) { this.id = id; }
    public void setEnrollmentId(Long enrollmentId) { this.enrollmentId = enrollmentId; }
    public void setStepId(Long stepId) { this.stepId = stepId; }
    public void setStatus(ProgressStatus status) { this.status = status; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

