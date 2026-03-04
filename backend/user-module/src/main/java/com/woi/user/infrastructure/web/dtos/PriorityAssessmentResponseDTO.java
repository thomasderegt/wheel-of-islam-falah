package com.woi.user.infrastructure.web.dtos;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Set;

/**
 * Response DTO for priority assessment
 */
public class PriorityAssessmentResponseDTO {
    private Long id;
    private Long userId;
    private Long falahCycleId;
    private Map<String, Integer> scores;
    private Set<String> skippedWheels;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getFalahCycleId() { return falahCycleId; }
    public void setFalahCycleId(Long falahCycleId) { this.falahCycleId = falahCycleId; }

    public Map<String, Integer> getScores() { return scores; }
    public void setScores(Map<String, Integer> scores) { this.scores = scores; }

    public Set<String> getSkippedWheels() { return skippedWheels; }
    public void setSkippedWheels(Set<String> skippedWheels) { this.skippedWheels = skippedWheels; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
