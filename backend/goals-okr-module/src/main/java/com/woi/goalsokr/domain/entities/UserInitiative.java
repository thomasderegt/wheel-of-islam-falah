package com.woi.goalsokr.domain.entities;

import com.woi.goalsokr.domain.enums.GoalStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * UserInitiative domain entity - Pure POJO (no JPA annotations)
 *
 * Represents a user-specific initiative created by an end user (not based on templates).
 * Users can create their own personal initiatives with custom titles and descriptions.
 *
 * Business rules:
 * - userId is required
 * - userKeyResultInstanceId is required (FK to UserKeyResultInstance)
 * - title is required and cannot be empty
 * - status defaults to ACTIVE
 * - targetDate can be null (no deadline)
 * - learningFlowEnrollmentId is optional (soft reference to learning flow enrollment)
 */
public class UserInitiative {
    private Long id;
    private Long userId; // Required - Soft reference to users.users
    private Long userKeyResultInstanceId; // Required - FK to UserKeyResultInstance
    private Long keyResultId; // Optional - FK to KeyResult (template reference)
    private String title; // Required
    private String description; // Optional
    private GoalStatus status;
    private LocalDate targetDate;
    private Long learningFlowEnrollmentId; // Optional - Soft reference to learning.learning_flow_enrollments
    private String number; // Unique human-readable number (e.g., "MY-INIT-123")
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime completedAt;

    // Public constructor for mappers (infrastructure layer)
    public UserInitiative() {}

    /**
     * Factory method: Create a new user-specific initiative
     *
     * @param userId User ID (required)
     * @param userKeyResultInstanceId User Key Result Instance ID (required)
     * @param title Initiative title (required)
     * @return New UserInitiative instance with ACTIVE status
     * @throws IllegalArgumentException if required fields are null or invalid
     */
    public static UserInitiative create(Long userId, Long userKeyResultInstanceId, String title) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (userKeyResultInstanceId == null) {
            throw new IllegalArgumentException("User Key Result Instance ID cannot be null");
        }
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Title cannot be null or empty");
        }

        UserInitiative initiative = new UserInitiative();
        initiative.userId = userId;
        initiative.userKeyResultInstanceId = userKeyResultInstanceId;
        initiative.title = title.trim();
        initiative.status = GoalStatus.ACTIVE;
        initiative.createdAt = LocalDateTime.now();
        initiative.updatedAt = LocalDateTime.now();
        initiative.completedAt = null;
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
        if (this.completedAt != null) {
            throw new IllegalStateException("Initiative is already completed");
        }
        this.status = GoalStatus.COMPLETED;
        this.completedAt = LocalDateTime.now();
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
        this.completedAt = null;
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

    /**
     * Check if initiative is completed
     */
    public boolean isCompleted() {
        return completedAt != null;
    }

    // Getters
    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public Long getUserKeyResultInstanceId() { return userKeyResultInstanceId; }
    public Long getKeyResultId() { return keyResultId; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public GoalStatus getStatus() { return status; }
    public LocalDate getTargetDate() { return targetDate; }
    public Long getLearningFlowEnrollmentId() { return learningFlowEnrollmentId; }
    public String getNumber() { return number; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }

    // Setters for entity mapping (infrastructure layer only)
    public void setId(Long id) { this.id = id; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setUserKeyResultInstanceId(Long userKeyResultInstanceId) { this.userKeyResultInstanceId = userKeyResultInstanceId; }
    public void setKeyResultId(Long keyResultId) { this.keyResultId = keyResultId; }
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
    public void setNumber(String number) { this.number = number; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
