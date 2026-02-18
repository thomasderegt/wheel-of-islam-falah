package com.woi.goalsokr.application.results;

import java.time.LocalDateTime;

/**
 * Result DTO for Objective
 */
public record ObjectiveResult(
    Long id,
    Long lifeDomainId,
    String titleNl,
    String titleEn,
    String descriptionNl,
    String descriptionEn,
    Integer orderIndex,
    String number,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static ObjectiveResult from(com.woi.goalsokr.domain.entities.Objective objective) {
        return new ObjectiveResult(
            objective.getId(),
            objective.getLifeDomainId(),
            objective.getTitleNl(),
            objective.getTitleEn(),
            objective.getDescriptionNl(),
            objective.getDescriptionEn(),
            objective.getOrderIndex(),
            objective.getNumber(),
            objective.getCreatedAt(),
            objective.getUpdatedAt()
        );
    }
}
