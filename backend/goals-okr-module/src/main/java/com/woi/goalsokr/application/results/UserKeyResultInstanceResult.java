package com.woi.goalsokr.application.results;

import java.time.LocalDateTime;

/**
 * Result DTO for UserKeyResultInstance
 */
public record UserKeyResultInstanceResult(
    Long id,
    Long userObjectiveInstanceId,
    Long keyResultId,
    String number,
    LocalDateTime startedAt,
    LocalDateTime completedAt
) {
    public static UserKeyResultInstanceResult from(com.woi.goalsokr.domain.entities.UserKeyResultInstance instance) {
        return new UserKeyResultInstanceResult(
            instance.getId(),
            instance.getUserObjectiveInstanceId(),
            instance.getKeyResultId(),
            instance.getNumber(),
            instance.getStartedAt(),
            instance.getCompletedAt()
        );
    }
}
