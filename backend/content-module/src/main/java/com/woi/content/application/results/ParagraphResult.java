package com.woi.content.application.results;

import java.time.LocalDateTime;

/**
 * Result DTO for Paragraph operations
 */
public record ParagraphResult(
    Long id,
    Long sectionId,
    Integer paragraphNumber,
    Long workingStatusParagraphVersionId,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static ParagraphResult from(com.woi.content.domain.entities.Paragraph paragraph) {
        return new ParagraphResult(
            paragraph.getId(),
            paragraph.getSectionId(),
            paragraph.getParagraphNumber(),
            paragraph.getWorkingStatusParagraphVersionId(),
            paragraph.getCreatedAt(),
            paragraph.getUpdatedAt()
        );
    }
}

