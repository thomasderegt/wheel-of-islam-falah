package com.woi.goalsokr.application.results;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Result DTO for UserInitiative
 */
public record UserInitiativeResult(
    Long id,
    Long userId,
    Long userKeyResultInstanceId,
    Long keyResultId,
    String title,
    String description,
    String status,
    LocalDate targetDate,
    Long learningFlowEnrollmentId,
    String number,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    LocalDateTime completedAt
) {
    public static UserInitiativeResult from(com.woi.goalsokr.domain.entities.UserInitiative initiative) {
        if (initiative == null) {
            throw new IllegalArgumentException("UserInitiative cannot be null");
        }
        if (initiative.getStatus() == null) {
            throw new IllegalStateException("UserInitiative status cannot be null for initiative ID: " + initiative.getId());
        }
        return new UserInitiativeResult(
            initiative.getId(),
            initiative.getUserId(),
            initiative.getUserKeyResultInstanceId(),
            initiative.getKeyResultId(),
            initiative.getTitle(),
            initiative.getDescription(),
            initiative.getStatus().name(),
            initiative.getTargetDate(),
            initiative.getLearningFlowEnrollmentId(),
            initiative.getNumber(),
            initiative.getCreatedAt(),
            initiative.getUpdatedAt(),
            initiative.getCompletedAt()
        );
    }
}
