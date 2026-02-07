package com.woi.content.application.results;

import java.time.LocalDateTime;

/**
 * Result DTO for Category operations
 */
public record CategoryResult(
    Long id,
    Integer categoryNumber,
    String titleNl,
    String titleEn,
    String subtitleNl,
    String subtitleEn,
    String descriptionNl,
    String descriptionEn,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static CategoryResult from(com.woi.content.domain.entities.Category category) {
        return new CategoryResult(
            category.getId(),
            category.getCategoryNumber(),
            category.getTitleNl(),
            category.getTitleEn(),
            category.getSubtitleNl(),
            category.getSubtitleEn(),
            category.getDescriptionNl(),
            category.getDescriptionEn(),
            category.getCreatedAt(),
            category.getUpdatedAt()
        );
    }
}

