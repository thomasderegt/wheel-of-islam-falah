package com.woi.goalsokr.application.results;

/**
 * Result DTO for Initiative (template)
 */
public record InitiativeResult(
    Long id,
    Long keyResultId,
    String titleNl,
    String titleEn,
    String descriptionNl,
    String descriptionEn,
    Long learningFlowTemplateId,
    Integer displayOrder
) {
    public static InitiativeResult from(com.woi.goalsokr.domain.entities.Initiative initiative) {
        if (initiative == null) {
            throw new IllegalArgumentException("Initiative cannot be null");
        }
        return new InitiativeResult(
            initiative.getId(),
            initiative.getKeyResultId(),
            initiative.getTitleNl(),
            initiative.getTitleEn(),
            initiative.getDescriptionNl(),
            initiative.getDescriptionEn(),
            initiative.getLearningFlowTemplateId(),
            initiative.getDisplayOrder()
        );
    }
}
