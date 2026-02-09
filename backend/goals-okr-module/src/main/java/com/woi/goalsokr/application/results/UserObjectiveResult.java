package com.woi.goalsokr.application.results;

import java.time.LocalDateTime;

/**
 * Result DTO for UserObjective
 */
public record UserObjectiveResult(
    Long id,
    Long userId,
    Long userGoalId,
    String title,
    String description,
    String number,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    LocalDateTime completedAt
) {
    public static UserObjectiveResult from(com.woi.goalsokr.domain.entities.UserObjective userObjective) {
        return new UserObjectiveResult(
            userObjective.getId(),
            userObjective.getUserId(),
            userObjective.getUserGoalId(),
            userObjective.getTitle(),
            userObjective.getDescription(),
            userObjective.getNumber(),
            userObjective.getCreatedAt(),
            userObjective.getUpdatedAt(),
            userObjective.getCompletedAt()
        );
    }
}
