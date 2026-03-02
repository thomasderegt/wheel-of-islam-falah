package com.woi.user.infrastructure.persistence.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * JPA entity for FalahCycle
 * Maps to database table users.falah_cycle
 */
@Entity
@Table(name = "falah_cycle", schema = "users")
public class FalahCycleJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "started_at", nullable = false)
    private LocalDateTime startedAt;

    @Column(name = "flow_exited_at")
    private LocalDateTime flowExitedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public FalahCycleJpaEntity() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }

    public LocalDateTime getFlowExitedAt() { return flowExitedAt; }
    public void setFlowExitedAt(LocalDateTime flowExitedAt) { this.flowExitedAt = flowExitedAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
