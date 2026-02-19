package com.woi.goalsokr.domain.entities;

import java.time.LocalDateTime;

/**
 * UserInitiativeInstance domain entity - Pure POJO (no JPA annotations)
 *
 * Represents a user-specific instance of an initiative within a UserKeyResultInstance.
 * Created when a user starts working on an initiative (template or user-created) within a key result instance.
 *
 * Business rules:
 * - userKeyResultInstanceId is required (FK to UserKeyResultInstance)
 * - initiativeId is required (reference to Initiative - template or custom)
 * - userId is accessed via UserKeyResultInstance → UserObjectiveInstance → UserGoalInstance (strikt DDD)
 */
public class UserInitiativeInstance {
    private Long id;
    private Long userKeyResultInstanceId; // Required - FK to UserKeyResultInstance
    private Long initiativeId; // Required - FK to Initiative (template) OR UserInitiative (user-created) - soft reference
    private String number; // Unique human-readable number (e.g., "INIT-SUB-123")
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;

    // Public constructor for mappers (infrastructure layer)
    public UserInitiativeInstance() {}

    /**
     * Factory method: Start a new user initiative instance
     *
     * @param userKeyResultInstanceId User Key Result Instance ID (required, reference to parent instance)
     * @param initiativeId Initiative ID (required, reference to Initiative)
     * @return New UserInitiativeInstance instance
     * @throws IllegalArgumentException if required fields are null
     */
    public static UserInitiativeInstance start(Long userKeyResultInstanceId, Long initiativeId) {
        if (userKeyResultInstanceId == null) {
            throw new IllegalArgumentException("User Key Result Instance ID cannot be null");
        }
        if (initiativeId == null) {
            throw new IllegalArgumentException("Initiative ID cannot be null");
        }

        UserInitiativeInstance instance = new UserInitiativeInstance();
        instance.userKeyResultInstanceId = userKeyResultInstanceId;
        instance.initiativeId = initiativeId;
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
    public Long getUserKeyResultInstanceId() { return userKeyResultInstanceId; }
    public Long getInitiativeId() { return initiativeId; }
    public String getNumber() { return number; }
    public LocalDateTime getStartedAt() { return startedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }

    // Setters for entity mapping (infrastructure layer only)
    public void setId(Long id) { this.id = id; }
    public void setUserKeyResultInstanceId(Long userKeyResultInstanceId) { this.userKeyResultInstanceId = userKeyResultInstanceId; }
    public void setInitiativeId(Long initiativeId) { this.initiativeId = initiativeId; }
    public void setNumber(String number) { this.number = number; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
