package com.woi.goalsokr.application.results;

import java.time.LocalDateTime;

/**
 * Result DTO for Goal
 */
public record GoalResult(
    Long id,
    Long lifeDomainId,
    String titleNl,
    String titleEn,
    String descriptionNl,
    String descriptionEn,
    Integer orderIndex,
    Integer quarter, // Program Increment quarter (1-4)
    Integer year,    // Program Increment year (e.g., 2025)
    String number,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static GoalResult from(com.woi.goalsokr.domain.entities.Goal goal) {
        return new GoalResult(
            goal.getId(),
            goal.getLifeDomainId(),
            goal.getTitleNl(),
            goal.getTitleEn(),
            goal.getDescriptionNl(),
            goal.getDescriptionEn(),
            goal.getOrderIndex(),
            goal.getQuarter(),
            goal.getYear(),
            goal.getNumber(),
            goal.getCreatedAt(),
            goal.getUpdatedAt()
        );
    }
}
