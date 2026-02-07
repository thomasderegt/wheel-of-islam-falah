package com.woi.goalsokr.domain.entities;

import com.woi.goalsokr.domain.enums.GoalStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Initiative domain entity - Pure POJO (no JPA annotations)
 *
 * Represents a concrete action/task to achieve a Key Result (user-specific).
 * Part of OKR structure: KeyResult → Initiative
 *
 * Business rules:
 * - keyResultId is required (reference to template)
 * - userObjectiveInstanceId is required (reference to user's instance)
 * - title is required
 * - status defaults to ACTIVE
 * - targetDate can be null (no deadline)
 * - learningFlowEnrollmentId is optional (soft reference to learning flow enrollment)
 * - userId is accessed via UserObjectiveInstance → UserGoalInstance (strikt DDD)
 */
public class Initiative {
    private Long id;
    private Long keyResultId; // Required - FK to KeyResult (template)
    private Long userObjectiveInstanceId; // Required - FK to UserObjectiveInstance (user's instance)
    private String title;
    private String description;
    private GoalStatus status;
    private LocalDate targetDate;
    private Long learningFlowEnrollmentId; // Optional - Soft reference to learning.learning_flow_enrollments
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Public constructor for mappers (infrastructure layer)
    public Initiative() {}

    /**
     * Factory method: Create a new initiative
     *
     * @param keyResultId Key Result ID (required)
     * @param userObjectiveInstanceId User Objective Instance ID (required)
     * @param title Initiative title (required)
     * @return New Initiative instance with ACTIVE status
     * @throws IllegalArgumentException if required fields are null or invalid
     */
    public static Initiative create(Long keyResultId, Long userObjectiveInstanceId, String title) {
        if (keyResultId == null) {
            throw new IllegalArgumentException("Key Result ID cannot be null");
        }
        if (userObjectiveInstanceId == null) {
            throw new IllegalArgumentException("User Objective Instance ID cannot be null");
        }
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Title cannot be null or empty");
        }

        Initiative initiative = new Initiative();
        initiative.keyResultId = keyResultId;
        initiative.userObjectiveInstanceId = userObjectiveInstanceId;
        initiative.title = title.trim();
        initiative.status = GoalStatus.ACTIVE;
        initiative.createdAt = LocalDateTime.now();
        initiative.updatedAt = LocalDateTime.now();
        return initiative;
    }

    /**
     * Update initiative title
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
     * Update initiative description
     */
    public void updateDescription(String description) {
        this.description = description;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Update target date
     */
    public void updateTargetDate(LocalDate targetDate) {
        this.targetDate = targetDate;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Mark initiative as completed
     */
    public void complete() {
        this.status = GoalStatus.COMPLETED;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Archive initiative
     */
    public void archive() {
        this.status = GoalStatus.ARCHIVED;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Reactivate initiative (from ARCHIVED or COMPLETED)
     */
    public void reactivate() {
        this.status = GoalStatus.ACTIVE;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Link initiative to a learning flow enrollment
     */
    public void linkLearningFlowEnrollment(Long learningFlowEnrollmentId) {
        this.learningFlowEnrollmentId = learningFlowEnrollmentId;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Unlink initiative from learning flow enrollment
     */
    public void unlinkLearningFlowEnrollment() {
        this.learningFlowEnrollmentId = null;
        this.updatedAt = LocalDateTime.now();
    }

    // Getters
    public Long getId() { return id; }
    public Long getKeyResultId() { return keyResultId; }
    public Long getUserObjectiveInstanceId() { return userObjectiveInstanceId; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public GoalStatus getStatus() { return status; }
    public LocalDate getTargetDate() { return targetDate; }
    public Long getLearningFlowEnrollmentId() { return learningFlowEnrollmentId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // Setters for entity mapping (infrastructure layer only)
    public void setId(Long id) { this.id = id; }
    public void setKeyResultId(Long keyResultId) { this.keyResultId = keyResultId; }
    public void setUserObjectiveInstanceId(Long userObjectiveInstanceId) { this.userObjectiveInstanceId = userObjectiveInstanceId; }
    /**
     * Setter for title - ONLY for entity mapping (infrastructure layer)
     * Validates that title is not null or empty (business invariant)
     * 
     * @param title Initiative title (required)
     * @throws IllegalArgumentException if title is null or empty
     */
    public void setTitle(String title) {
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Title cannot be null or empty");
        }
        this.title = title.trim();
    }
    public void setDescription(String description) { this.description = description; }
    public void setStatus(GoalStatus status) {
        if (status == null) {
            throw new IllegalArgumentException("Status cannot be null");
        }
        this.status = status;
        this.updatedAt = LocalDateTime.now();
    }
    public void setTargetDate(LocalDate targetDate) { this.targetDate = targetDate; }
    public void setLearningFlowEnrollmentId(Long learningFlowEnrollmentId) { this.learningFlowEnrollmentId = learningFlowEnrollmentId; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
