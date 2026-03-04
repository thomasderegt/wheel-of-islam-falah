package com.woi.user.infrastructure.web.dtos;

import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.Map;

/**
 * Request DTO for saving a priority assessment
 */
public class SavePriorityAssessmentRequestDTO {
    @NotNull(message = "scores cannot be null")
    private Map<String, Integer> scores;

    private List<String> skippedWheels;

    /** Optional: link to Falah cycle. If null, saves standalone assessment. */
    private Long falahCycleId;

    public Map<String, Integer> getScores() { return scores; }
    public void setScores(Map<String, Integer> scores) { this.scores = scores; }

    public List<String> getSkippedWheels() { return skippedWheels; }
    public void setSkippedWheels(List<String> skippedWheels) { this.skippedWheels = skippedWheels; }

    public Long getFalahCycleId() { return falahCycleId; }
    public void setFalahCycleId(Long falahCycleId) { this.falahCycleId = falahCycleId; }
}
