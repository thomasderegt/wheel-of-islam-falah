package com.woi.goalsokr.infrastructure.persistence.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * JPA entity for UserKeyResultInstance (database mapping)
 */
@Entity
@Table(name = "user_key_result_instances", schema = "goals_okr")
public class UserKeyResultInstanceJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "user_objective_instance_id", nullable = false)
    private Long userObjectiveInstanceId; // FK to goals_okr.user_objective_instances

    @Column(name = "key_result_id", nullable = false)
    private Long keyResultId; // FK to goals_okr.key_results

    @Column(name = "started_at", nullable = false)
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    // Public constructor for JPA
    public UserKeyResultInstanceJpaEntity() {}

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserObjectiveInstanceId() { return userObjectiveInstanceId; }
    public void setUserObjectiveInstanceId(Long userObjectiveInstanceId) { this.userObjectiveInstanceId = userObjectiveInstanceId; }

    public Long getKeyResultId() { return keyResultId; }
    public void setKeyResultId(Long keyResultId) { this.keyResultId = keyResultId; }

    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
