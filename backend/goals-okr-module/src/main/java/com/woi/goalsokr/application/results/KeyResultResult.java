package com.woi.goalsokr.application.results;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Result DTO for KeyResult
 */
public record KeyResultResult(
    Long id,
    Long objectiveId,
    String titleNl,
    String titleEn,
    String descriptionNl,
    String descriptionEn,
    BigDecimal targetValue,
    String unit,
    Integer orderIndex,
    String number,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static KeyResultResult from(com.woi.goalsokr.domain.entities.KeyResult keyResult) {
        return new KeyResultResult(
            keyResult.getId(),
            keyResult.getObjectiveId(),
            keyResult.getTitleNl(),
            keyResult.getTitleEn(),
            keyResult.getDescriptionNl(),
            keyResult.getDescriptionEn(),
            keyResult.getTargetValue(),
            keyResult.getUnit(),
            keyResult.getOrderIndex(),
            keyResult.getNumber(),
            keyResult.getCreatedAt(),
            keyResult.getUpdatedAt()
        );
    }
}
