package com.woi.goalsokr.infrastructure.persistence.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * JPA entity for UserObjectiveInstance (database mapping)
 */
@Entity
@Table(name = "user_objective_instances", schema = "goals_okr")
public class UserObjectiveInstanceJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "user_goal_instance_id", nullable = false)
    private Long userGoalInstanceId; // FK to goals_okr.user_goal_instances (aggregate root)

    @Column(name = "objective_id", nullable = false)
    private Long objectiveId; // FK to goals_okr.objectives

    @Column(name = "number", length = 50)
    private String number;

    @Column(name = "started_at", nullable = false)
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    // Public constructor for JPA
    public UserObjectiveInstanceJpaEntity() {}

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserGoalInstanceId() { return userGoalInstanceId; }
    public void setUserGoalInstanceId(Long userGoalInstanceId) { this.userGoalInstanceId = userGoalInstanceId; }

    public Long getObjectiveId() { return objectiveId; }
    public void setObjectiveId(Long objectiveId) { this.objectiveId = objectiveId; }

    public String getNumber() { return number; }
    public void setNumber(String number) { this.number = number; }

    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
