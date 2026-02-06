package com.woi.goalsokr.domain.entities;

import java.time.LocalDateTime;

/**
 * UserGoalInstance domain entity - Pure POJO (no JPA annotations)
 *
 * Represents a user-specific instance of a goal (subscription/enrollment).
 * This is the aggregate root for user-specific OKR instances.
 * Created when a user starts working on a goal template.
 *
 * Business rules:
 * - userId is required (⭐ ONLY place where userId exists in the aggregate)
 * - goalId is required (reference to template goal)
 * - A user can only have one active instance per goal (enforced by unique constraint)
 */
public class UserGoalInstance {
    private Long id;
    private Long userId; // ⭐ ALLEEN hier in de aggregate!
    private Long goalId; // Required - FK to Goal (template)
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;

    // Public constructor for mappers (infrastructure layer)
    public UserGoalInstance() {}

    /**
     * Factory method: Start a new user goal instance (subscription/enrollment)
     *
     * @param userId User ID (required)
     * @param goalId Goal ID (required, reference to template)
     * @return New UserGoalInstance instance
     * @throws IllegalArgumentException if required fields are null
     */
    public static UserGoalInstance start(Long userId, Long goalId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (goalId == null) {
            throw new IllegalArgumentException("Goal ID cannot be null");
        }

        UserGoalInstance instance = new UserGoalInstance();
        instance.userId = userId;
        instance.goalId = goalId;
        instance.startedAt = LocalDateTime.now();
        instance.completedAt = null;

        return instance;
    }

    /**
     * Mark this instance as completed
     */
    public void complete() {
        if (this.completedAt != null) {
            throw new IllegalStateException("Instance is already completed");
        }
        this.completedAt = LocalDateTime.now();
    }

    /**
     * Check if this instance is completed
     */
    public boolean isCompleted() {
        return completedAt != null;
    }

    // Getters
    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public Long getGoalId() { return goalId; }
    public LocalDateTime getStartedAt() { return startedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }

    // Setters for entity mapping (infrastructure layer only)
    public void setId(Long id) { this.id = id; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setGoalId(Long goalId) { this.goalId = goalId; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
