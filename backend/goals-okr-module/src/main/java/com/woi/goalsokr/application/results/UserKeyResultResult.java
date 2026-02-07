package com.woi.goalsokr.application.results;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Result DTO for UserKeyResult
 */
public record UserKeyResultResult(
    Long id,
    Long userId,
    Long userObjectiveId,
    String title,
    String description,
    BigDecimal targetValue,
    String unit,
    BigDecimal currentValue,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    LocalDateTime completedAt
) {
    public static UserKeyResultResult from(com.woi.goalsokr.domain.entities.UserKeyResult userKeyResult) {
        return new UserKeyResultResult(
            userKeyResult.getId(),
            userKeyResult.getUserId(),
            userKeyResult.getUserObjectiveId(),
            userKeyResult.getTitle(),
            userKeyResult.getDescription(),
            userKeyResult.getTargetValue(),
            userKeyResult.getUnit(),
            userKeyResult.getCurrentValue(),
            userKeyResult.getCreatedAt(),
            userKeyResult.getUpdatedAt(),
            userKeyResult.getCompletedAt()
        );
    }
}
