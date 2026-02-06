package com.woi.goalsokr.domain.entities;

import java.time.LocalDateTime;

/**
 * UserObjectiveInstance domain entity - Pure POJO (no JPA annotations)
 *
 * Represents a user-specific instance of an objective within a UserGoalInstance.
 * Created when a user starts working on an objective template within a goal instance.
 *
 * Business rules:
 * - userGoalInstanceId is required (FK to UserGoalInstance - aggregate root)
 * - objectiveId is required (reference to template objective)
 * - userId is accessed via UserGoalInstance (strikt DDD)
 */
public class UserObjectiveInstance {
    private Long id;
    private Long userGoalInstanceId; // Required - FK to UserGoalInstance (aggregate root)
    private Long objectiveId; // Required - FK to Objective (template)
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;

    // Public constructor for mappers (infrastructure layer)
    public UserObjectiveInstance() {}

    /**
     * Factory method: Start a new user objective instance
     *
     * @param userGoalInstanceId User Goal Instance ID (required, reference to aggregate root)
     * @param objectiveId Objective ID (required, reference to template)
     * @return New UserObjectiveInstance instance
     * @throws IllegalArgumentException if required fields are null
     */
    public static UserObjectiveInstance start(Long userGoalInstanceId, Long objectiveId) {
        if (userGoalInstanceId == null) {
            throw new IllegalArgumentException("User Goal Instance ID cannot be null");
        }
        if (objectiveId == null) {
            throw new IllegalArgumentException("Objective ID cannot be null");
        }

        UserObjectiveInstance instance = new UserObjectiveInstance();
        instance.userGoalInstanceId = userGoalInstanceId;
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
    public Long getUserGoalInstanceId() { return userGoalInstanceId; }
    public Long getObjectiveId() { return objectiveId; }
    public LocalDateTime getStartedAt() { return startedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }

    // Setters for entity mapping (infrastructure layer only)
    public void setId(Long id) { this.id = id; }
    public void setUserGoalInstanceId(Long userGoalInstanceId) { this.userGoalInstanceId = userGoalInstanceId; }
    public void setObjectiveId(Long objectiveId) { this.objectiveId = objectiveId; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
