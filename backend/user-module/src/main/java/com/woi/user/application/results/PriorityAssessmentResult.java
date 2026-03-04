package com.woi.user.application.results;

import com.woi.user.domain.entities.PriorityAssessment;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Set;

public record PriorityAssessmentResult(
    Long id,
    Long userId,
    Long falahCycleId,
    Map<String, Integer> scores,
    Set<String> skippedWheels,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static PriorityAssessmentResult from(PriorityAssessment a) {
        if (a == null) return null;
        return new PriorityAssessmentResult(
            a.getId(),
            a.getUserId(),
            a.getFalahCycleId(),
            a.getScores() == null ? Map.of() : Map.copyOf(a.getScores()),
            a.getSkippedWheels() == null ? Set.of() : Set.copyOf(a.getSkippedWheels()),
            a.getCreatedAt(),
            a.getUpdatedAt()
        );
    }
}
