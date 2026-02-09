package com.woi.goalsokr.domain.entities;

import java.time.LocalDateTime;

/**
 * UserKeyResultInstance domain entity - Pure POJO (no JPA annotations)
 *
 * Represents a user-specific instance of a key result within a UserObjectiveInstance.
 * Created when a user starts working on a key result template within an objective instance.
 *
 * Business rules:
 * - userObjectiveInstanceId is required (FK to UserObjectiveInstance)
 * - keyResultId is required (reference to template key result)
 * - userId is accessed via UserObjectiveInstance → UserGoalInstance (strikt DDD)
 */
public class UserKeyResultInstance {
    private Long id;
    private Long userObjectiveInstanceId; // Required - FK to UserObjectiveInstance
    private Long keyResultId; // Required - FK to KeyResult (template)
    private String number; // Unique human-readable number (e.g., "KR-SUB-123")
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;

    // Public constructor for mappers (infrastructure layer)
    public UserKeyResultInstance() {}

    /**
     * Factory method: Start a new user key result instance
     *
     * @param userObjectiveInstanceId User Objective Instance ID (required, reference to parent instance)
     * @param keyResultId Key Result ID (required, reference to template)
     * @return New UserKeyResultInstance instance
     * @throws IllegalArgumentException if required fields are null
     */
    public static UserKeyResultInstance start(Long userObjectiveInstanceId, Long keyResultId) {
        if (userObjectiveInstanceId == null) {
            throw new IllegalArgumentException("User Objective Instance ID cannot be null");
        }
        if (keyResultId == null) {
            throw new IllegalArgumentException("Key Result ID cannot be null");
        }

        UserKeyResultInstance instance = new UserKeyResultInstance();
        instance.userObjectiveInstanceId = userObjectiveInstanceId;
        instance.keyResultId = keyResultId;
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
    public Long getUserObjectiveInstanceId() { return userObjectiveInstanceId; }
    public Long getKeyResultId() { return keyResultId; }
    public String getNumber() { return number; }
    public LocalDateTime getStartedAt() { return startedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }

    // Setters for entity mapping (infrastructure layer only)
    public void setId(Long id) { this.id = id; }
    public void setUserObjectiveInstanceId(Long userObjectiveInstanceId) { this.userObjectiveInstanceId = userObjectiveInstanceId; }
    public void setKeyResultId(Long keyResultId) { this.keyResultId = keyResultId; }
    public void setNumber(String number) { this.number = number; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
