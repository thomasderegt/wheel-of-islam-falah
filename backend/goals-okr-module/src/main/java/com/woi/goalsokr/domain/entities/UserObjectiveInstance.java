package com.woi.goalsokr.domain.entities;

import java.time.LocalDateTime;

/**
 * UserObjectiveInstance domain entity - Pure POJO (no JPA annotations)
 *
 * Represents a user-specific instance of an objective.
 * Created when a user starts working on an objective template.
 *
 * Business rules:
 * - userId is required (soft reference to users)
 * - objectiveId is required (reference to template objective)
 */
public class UserObjectiveInstance {
    private Long id;
    private Long userId; // Required - soft reference to users.users
    private Long objectiveId; // Required - FK to Objective (template)
    private String number; // Unique human-readable number (e.g., "OBJ-SUB-123")
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;

    // Public constructor for mappers (infrastructure layer)
    public UserObjectiveInstance() {}

    /**
     * Factory method: Start a new user objective instance
     *
     * @param userId User ID (required)
     * @param objectiveId Objective ID (required, reference to template)
     * @return New UserObjectiveInstance instance
     * @throws IllegalArgumentException if required fields are null
     */
    public static UserObjectiveInstance start(Long userId, Long objectiveId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (objectiveId == null) {
            throw new IllegalArgumentException("Objective ID cannot be null");
        }

        UserObjectiveInstance instance = new UserObjectiveInstance();
        instance.userId = userId;
        instance.objectiveId = objectiveId;
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
    public Long getObjectiveId() { return objectiveId; }
    public String getNumber() { return number; }
    public LocalDateTime getStartedAt() { return startedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }

    // Setters for entity mapping (infrastructure layer only)
    public void setId(Long id) { this.id = id; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setObjectiveId(Long objectiveId) { this.objectiveId = objectiveId; }
    public void setNumber(String number) { this.number = number; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
