package com.woi.user.domain.entities;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Set;

/**
 * Priority assessment domain entity.
 * Stores user priority scores per wheel (Falah, Life, Business, Work).
 * Optionally linked to a Falah cycle.
 */
public class PriorityAssessment {
    private Long id;
    private Long userId;
    private Long falahCycleId;
    private Map<String, Integer> scores;
    private Set<String> skippedWheels;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PriorityAssessment() {}

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public Long getFalahCycleId() { return falahCycleId; }
    public Map<String, Integer> getScores() { return scores; }
    public Set<String> getSkippedWheels() { return skippedWheels; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setId(Long id) { this.id = id; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setFalahCycleId(Long falahCycleId) { this.falahCycleId = falahCycleId; }
    public void setScores(Map<String, Integer> scores) { this.scores = scores; }
    public void setSkippedWheels(Set<String> skippedWheels) { this.skippedWheels = skippedWheels; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
