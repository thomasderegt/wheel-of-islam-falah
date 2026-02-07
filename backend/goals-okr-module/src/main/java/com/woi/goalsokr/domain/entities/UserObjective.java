package com.woi.goalsokr.domain.entities;

import java.time.LocalDateTime;

/**
 * UserObjective domain entity - Pure POJO (no JPA annotations)
 *
 * Represents a user-specific objective created by an end user (not based on templates).
 * Belongs to a UserGoal and contains user-specific key results.
 *
 * Business rules:
 * - userId is required
 * - userGoalId is required (FK to UserGoal)
 * - title is required and cannot be empty
 * - completedAt can be set to mark objective as completed
 */
public class UserObjective {
    private Long id;
    private Long userId; // Required - Soft reference to users.users
    private Long userGoalId; // Required - FK to UserGoal
    private String title; // Required
    private String description; // Optional
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime completedAt;

    // Public constructor for mappers (infrastructure layer)
    public UserObjective() {}

    /**
     * Factory method: Create a new user-specific objective
     *
     * @param userId User ID (required)
     * @param userGoalId User Goal ID (required)
     * @param title Objective title (required)
     * @return New UserObjective instance
     * @throws IllegalArgumentException if required fields are null or invalid
     */
    public static UserObjective create(Long userId, Long userGoalId, String title) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (userGoalId == null) {
            throw new IllegalArgumentException("User Goal ID cannot be null");
        }
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Title cannot be null or empty");
        }

        UserObjective objective = new UserObjective();
        objective.userId = userId;
        objective.userGoalId = userGoalId;
        objective.title = title.trim();
        objective.createdAt = LocalDateTime.now();
        objective.updatedAt = LocalDateTime.now();
        objective.completedAt = null;
        return objective;
    }

    /**
     * Update objective title
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
     * Update objective description
     */
    public void updateDescription(String description) {
        this.description = description;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Mark objective as completed
     */
    public void complete() {
        if (this.completedAt != null) {
            throw new IllegalStateException("Objective is already completed");
        }
        this.completedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Reopen a completed objective
     */
    public void reopen() {
        this.completedAt = null;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Check if objective is completed
     */
    public boolean isCompleted() {
        return completedAt != null;
    }

    // Getters
    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public Long getUserGoalId() { return userGoalId; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }

    // Setters for entity mapping (infrastructure layer only)
    public void setId(Long id) { this.id = id; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setUserGoalId(Long userGoalId) { this.userGoalId = userGoalId; }
    /**
     * Setter for title - ONLY for entity mapping (infrastructure layer)
     * Validates that title is not null or empty (business invariant)
     * 
     * @param title Objective title (required)
     * @throws IllegalArgumentException if title is null or empty
     */
    public void setTitle(String title) {
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Title cannot be null or empty");
        }
        this.title = title.trim();
    }
    public void setDescription(String description) { this.description = description; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
