package com.woi.goalsokr.application.results;

import java.time.LocalDateTime;

/**
 * Result DTO for UserGoalInstance
 */
public record UserGoalInstanceResult(
    Long id,
    Long userId,
    Long goalId,
    String number,
    LocalDateTime startedAt,
    LocalDateTime completedAt
) {
    public static UserGoalInstanceResult from(com.woi.goalsokr.domain.entities.UserGoalInstance instance) {
        return new UserGoalInstanceResult(
            instance.getId(),
            instance.getUserId(),
            instance.getGoalId(),
            instance.getNumber(),
            instance.getStartedAt(),
            instance.getCompletedAt()
        );
    }
}
