package com.woi.user.domain.entities;

import java.time.LocalDateTime;

/**
 * FalahCycle domain entity - Pure POJO (no JPA annotations)
 * Represents a user's Falah growth cycle: Falah → Assessment → Goals → Execute → Insight → repeat
 */
public class FalahCycle {
    private Long id;
    private Long userId;
    private LocalDateTime startedAt;
    private LocalDateTime flowExitedAt;
    private LocalDateTime completedAt;

    /** Constructor for persistence mapping (infrastructure layer) */
    public FalahCycle() {}

    /**
     * Factory method: Start a new Falah cycle
     *
     * @param userId User ID
     * @return New FalahCycle instance
     * @throws IllegalArgumentException if userId is null
     */
    public static FalahCycle start(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        FalahCycle cycle = new FalahCycle();
        cycle.userId = userId;
        cycle.startedAt = LocalDateTime.now();
        cycle.flowExitedAt = null;
        cycle.completedAt = null;
        return cycle;
    }

    /**
     * Exit the cycle creation flow (Finish) - cycle stays active
     */
    public void exitFlow() {
        if (this.completedAt != null) {
            throw new IllegalArgumentException("Cannot exit flow: cycle already completed");
        }
        this.flowExitedAt = LocalDateTime.now();
    }

    /**
     * Re-enter the cycle creation flow (Continue)
     */
    public void reEnterFlow() {
        if (this.completedAt != null) {
            throw new IllegalArgumentException("Cannot re-enter flow: cycle already completed");
        }
        this.flowExitedAt = null;
    }

    /**
     * Mark the cycle as completed
     */
    public void complete() {
        this.completedAt = LocalDateTime.now();
    }

    /**
     * Check if the cycle is still active (not completed)
     */
    public boolean isActive() {
        return completedAt == null;
    }

    /**
     * Check if user has exited the creation flow (Finish clicked)
     */
    public boolean isFlowExited() {
        return flowExitedAt != null;
    }

    // Getters
    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public LocalDateTime getStartedAt() { return startedAt; }
    public LocalDateTime getFlowExitedAt() { return flowExitedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }

    /**
     * Setters for persistence mapping (infrastructure layer only)
     */
    public void setId(Long id) { this.id = id; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
    public void setFlowExitedAt(LocalDateTime flowExitedAt) { this.flowExitedAt = flowExitedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
