package com.woi.content.application.results;

import java.time.LocalDateTime;

/**
 * Result DTO for ParagraphVersion operations
 */
public record ParagraphVersionResult(
    Long id,
    Long paragraphId,
    Integer versionNumber,
    String titleEn,
    String titleNl,
    String contentEn,
    String contentNl,
    Long createdBy,
    LocalDateTime createdAt
) {
    public static ParagraphVersionResult from(com.woi.content.domain.entities.ParagraphVersion version) {
        return new ParagraphVersionResult(
            version.getId(),
            version.getParagraphId(),
            version.getVersionNumber(),
            version.getTitleEn(),
            version.getTitleNl(),
            version.getContentEn(),
            version.getContentNl(),
            version.getCreatedBy(),
            version.getCreatedAt()
        );
    }
}

