package com.woi.goalsokr.application.results;

/**
 * Result DTO for InitiativeSuggestion
 */
public record InitiativeSuggestionResult(
    Long id,
    Long keyResultId,
    String titleNl,
    String titleEn,
    String descriptionNl,
    String descriptionEn,
    Long learningFlowTemplateId,
    Integer displayOrder
) {
    public static InitiativeSuggestionResult from(com.woi.goalsokr.domain.entities.InitiativeSuggestion suggestion) {
        if (suggestion == null) {
            throw new IllegalArgumentException("InitiativeSuggestion cannot be null");
        }
        return new InitiativeSuggestionResult(
            suggestion.getId(),
            suggestion.getKeyResultId(),
            suggestion.getTitleNl(),
            suggestion.getTitleEn(),
            suggestion.getDescriptionNl(),
            suggestion.getDescriptionEn(),
            suggestion.getLearningFlowTemplateId(),
            suggestion.getDisplayOrder()
        );
    }
}
