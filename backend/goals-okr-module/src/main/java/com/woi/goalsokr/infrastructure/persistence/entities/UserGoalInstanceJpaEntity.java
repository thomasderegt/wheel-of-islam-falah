package com.woi.goalsokr.infrastructure.persistence.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * JPA entity for UserGoalInstance (database mapping)
 */
@Entity
@Table(name = "user_goal_instances", schema = "goals_okr")
public class UserGoalInstanceJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId; // ⭐ ALLEEN hier in de aggregate! Soft reference to users.users

    @Column(name = "goal_id", nullable = false)
    private Long goalId; // FK to goals_okr.goals (template)

    @Column(name = "number", length = 50)
    private String number;

    @Column(name = "started_at", nullable = false)
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    // Public constructor for JPA
    public UserGoalInstanceJpaEntity() {}

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getGoalId() { return goalId; }
    public void setGoalId(Long goalId) { this.goalId = goalId; }

    public String getNumber() { return number; }
    public void setNumber(String number) { this.number = number; }

    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
