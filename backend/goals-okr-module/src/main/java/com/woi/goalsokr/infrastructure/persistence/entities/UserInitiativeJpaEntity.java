package com.woi.goalsokr.infrastructure.persistence.entities;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * JPA entity for UserInitiative (user-created) - database mapping
 */
@Entity
@Table(name = "user_initiatives", schema = "goals_okr")
public class UserInitiativeJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId; // Soft reference to users.users

    @Column(name = "user_key_result_instance_id", nullable = false)
    private Long userKeyResultInstanceId; // FK to goals_okr.user_key_result_instances

    @Column(name = "key_result_id")
    private Long keyResultId; // Optional - FK to goals_okr.key_results (template reference)

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "status", nullable = false, length = 50)
    private String status; // ACTIVE, COMPLETED, ARCHIVED

    @Column(name = "target_date")
    private LocalDate targetDate;

    @Column(name = "learning_flow_enrollment_id")
    private Long learningFlowEnrollmentId; // Optional - Soft reference to learning.learning_flow_enrollments

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    // Public constructor for JPA
    public UserInitiativeJpaEntity() {}

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getUserKeyResultInstanceId() { return userKeyResultInstanceId; }
    public void setUserKeyResultInstanceId(Long userKeyResultInstanceId) { this.userKeyResultInstanceId = userKeyResultInstanceId; }

    public Long getKeyResultId() { return keyResultId; }
    public void setKeyResultId(Long keyResultId) { this.keyResultId = keyResultId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getTargetDate() { return targetDate; }
    public void setTargetDate(LocalDate targetDate) { this.targetDate = targetDate; }

    public Long getLearningFlowEnrollmentId() { return learningFlowEnrollmentId; }
    public void setLearningFlowEnrollmentId(Long learningFlowEnrollmentId) { this.learningFlowEnrollmentId = learningFlowEnrollmentId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
