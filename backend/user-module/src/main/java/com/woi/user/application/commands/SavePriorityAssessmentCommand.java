package com.woi.user.application.commands;

import java.util.Map;
import java.util.Set;

/**
 * Command to save or update a priority assessment.
 * If falahCycleId is null, saves/updates the standalone assessment.
 */
public record SavePriorityAssessmentCommand(
    Long userId,
    Map<String, Integer> scores,
    Set<String> skippedWheels,
    Long falahCycleId
) {
    public SavePriorityAssessmentCommand {
        if (userId == null) throw new IllegalArgumentException("userId cannot be null");
        scores = scores == null ? Map.of() : Map.copyOf(scores);
        skippedWheels = skippedWheels == null ? Set.of() : Set.copyOf(skippedWheels);
    }
}
