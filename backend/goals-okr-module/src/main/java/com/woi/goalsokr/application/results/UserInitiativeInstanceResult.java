package com.woi.goalsokr.application.results;

import java.time.LocalDateTime;

/**
 * Result DTO for UserInitiativeInstance
 */
public record UserInitiativeInstanceResult(
    Long id,
    Long userKeyResultInstanceId,
    Long initiativeId,
    String number,
    LocalDateTime startedAt,
    LocalDateTime completedAt
) {
    public static UserInitiativeInstanceResult from(com.woi.goalsokr.domain.entities.UserInitiativeInstance instance) {
        return new UserInitiativeInstanceResult(
            instance.getId(),
            instance.getUserKeyResultInstanceId(),
            instance.getInitiativeId(),
            instance.getNumber(),
            instance.getStartedAt(),
            instance.getCompletedAt()
        );
    }
}
