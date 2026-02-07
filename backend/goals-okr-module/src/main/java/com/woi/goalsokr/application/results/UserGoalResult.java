package com.woi.goalsokr.application.results;

import java.time.LocalDateTime;

/**
 * Result DTO for UserGoal
 */
public record UserGoalResult(
    Long id,
    Long userId,
    Long lifeDomainId,
    String title,
    String description,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    LocalDateTime completedAt
) {
    public static UserGoalResult from(com.woi.goalsokr.domain.entities.UserGoal userGoal) {
        return new UserGoalResult(
            userGoal.getId(),
            userGoal.getUserId(),
            userGoal.getLifeDomainId(),
            userGoal.getTitle(),
            userGoal.getDescription(),
            userGoal.getCreatedAt(),
            userGoal.getUpdatedAt(),
            userGoal.getCompletedAt()
        );
    }
}
