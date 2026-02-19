package com.woi.goalsokr.application.results;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Result DTO for initiatives (both template and custom, unified for API)
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
    LocalDateTime completedAt,
    Long userInitiativeInstanceId
) {
    /**
     * Create from Initiative (unified model - template or custom)
     */
    public static UserInitiativeResult from(com.woi.goalsokr.domain.entities.Initiative initiative,
            Long userKeyResultInstanceId, Long userId, Long userInitiativeInstanceId) {
        if (initiative == null) {
            throw new IllegalArgumentException("Initiative cannot be null");
        }
        String title = initiative.getTitleEn() != null ? initiative.getTitleEn() : initiative.getTitleNl();
        String description = initiative.getDescriptionEn() != null ? initiative.getDescriptionEn() : initiative.getDescriptionNl();
        return new UserInitiativeResult(
            initiative.getId(),
            userId != null ? userId : initiative.getCreatedByUserId(),
            userKeyResultInstanceId,
            initiative.getKeyResultId(),
            title,
            description,
            initiative.getStatus() != null ? initiative.getStatus() : "ACTIVE",
            initiative.getTargetDate(),
            initiative.getLearningFlowEnrollmentId(),
            initiative.getNumber(),
            initiative.getCreatedAt(),
            initiative.getUpdatedAt(),
            initiative.getCompletedAt(),
            userInitiativeInstanceId
        );
    }
}
