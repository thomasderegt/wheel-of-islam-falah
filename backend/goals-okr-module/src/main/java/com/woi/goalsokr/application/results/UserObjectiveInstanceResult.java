package com.woi.goalsokr.application.results;

import java.time.LocalDateTime;

/**
 * Result DTO for UserObjectiveInstance
 */
public record UserObjectiveInstanceResult(
    Long id,
    Long userGoalInstanceId,
    Long objectiveId,
    String number,
    LocalDateTime startedAt,
    LocalDateTime completedAt
) {
    public static UserObjectiveInstanceResult from(com.woi.goalsokr.domain.entities.UserObjectiveInstance instance) {
        return new UserObjectiveInstanceResult(
            instance.getId(),
            instance.getUserGoalInstanceId(),
            instance.getObjectiveId(),
            instance.getNumber(),
            instance.getStartedAt(),
            instance.getCompletedAt()
        );
    }
}
