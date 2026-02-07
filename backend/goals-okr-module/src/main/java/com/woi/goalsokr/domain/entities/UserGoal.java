package com.woi.goalsokr.domain.entities;

import java.time.LocalDateTime;

/**
 * UserGoal domain entity - Pure POJO (no JPA annotations)
 *
 * Represents a user-specific goal created by an end user (not based on templates).
 * Users can create their own personal goals with custom titles and descriptions.
 *
 * Business rules:
 * - userId is required
 * - title is required and cannot be empty
 * - lifeDomainId is optional (for categorization)
 * - completedAt can be set to mark goal as completed
 */
public class UserGoal {
    private Long id;
    private Long userId; // Required - Soft reference to users.users
    private Long lifeDomainId; // Optional - FK to LifeDomain for categorization
    private String title; // Required
    private String description; // Optional
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime completedAt;

    // Public constructor for mappers (infrastructure layer)
    public UserGoal() {}

    /**
     * Factory method: Create a new user-specific goal
     *
     * @param userId User ID (required)
     * @param title Goal title (required)
     * @return New UserGoal instance
     * @throws IllegalArgumentException if required fields are null or invalid
     */
    public static UserGoal create(Long userId, String title) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Title cannot be null or empty");
        }

        UserGoal goal = new UserGoal();
        goal.userId = userId;
        goal.title = title.trim();
        goal.createdAt = LocalDateTime.now();
        goal.updatedAt = LocalDateTime.now();
        goal.completedAt = null;
        return goal;
    }

    /**
     * Update goal title
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
     * Update goal description
     */
    public void updateDescription(String description) {
        this.description = description;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Set life domain for categorization
     */
    public void setLifeDomain(Long lifeDomainId) {
        this.lifeDomainId = lifeDomainId;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Mark goal as completed
     */
    public void complete() {
        if (this.completedAt != null) {
            throw new IllegalStateException("Goal is already completed");
        }
        this.completedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Reopen a completed goal
     */
    public void reopen() {
        this.completedAt = null;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Check if goal is completed
     */
    public boolean isCompleted() {
        return completedAt != null;
    }

    // Getters
    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public Long getLifeDomainId() { return lifeDomainId; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }

    // Setters for entity mapping (infrastructure layer only)
    public void setId(Long id) { this.id = id; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setLifeDomainId(Long lifeDomainId) { this.lifeDomainId = lifeDomainId; }
    /**
     * Setter for title - ONLY for entity mapping (infrastructure layer)
     * Validates that title is not null or empty (business invariant)
     * 
     * @param title Goal title (required)
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
