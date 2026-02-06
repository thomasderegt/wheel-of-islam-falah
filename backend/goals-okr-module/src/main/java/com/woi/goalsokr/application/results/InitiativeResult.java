package com.woi.goalsokr.application.results;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Result DTO for Initiative
 */
public record InitiativeResult(
    Long id,
    Long keyResultId,
    Long userObjectiveInstanceId,
    String title,
    String description,
    String status,
    LocalDate targetDate,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static InitiativeResult from(com.woi.goalsokr.domain.entities.Initiative initiative) {
        if (initiative == null) {
            throw new IllegalArgumentException("Initiative cannot be null");
        }
        if (initiative.getStatus() == null) {
            throw new IllegalStateException("Initiative status cannot be null for initiative ID: " + initiative.getId());
        }
        return new InitiativeResult(
            initiative.getId(),
            initiative.getKeyResultId(),
            initiative.getUserObjectiveInstanceId(),
            initiative.getTitle(),
            initiative.getDescription(),
            initiative.getStatus().name(),
            initiative.getTargetDate(),
            initiative.getCreatedAt(),
            initiative.getUpdatedAt()
        );
    }
}
