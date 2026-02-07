package com.woi.goalsokr.application.results;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Result DTO for KeyResultProgress
 */
public record KeyResultProgressResult(
    Long id,
    Long keyResultId,
    Long userKeyResultInstanceId,
    BigDecimal currentValue,
    LocalDateTime updatedAt
) {
    public static KeyResultProgressResult from(com.woi.goalsokr.domain.entities.KeyResultProgress progress) {
        return new KeyResultProgressResult(
            progress.getId(),
            progress.getKeyResultId(),
            progress.getUserKeyResultInstanceId(),
            progress.getCurrentValue(),
            progress.getUpdatedAt()
        );
    }
}
