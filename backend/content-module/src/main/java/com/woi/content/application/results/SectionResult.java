package com.woi.content.application.results;

import java.time.LocalDateTime;

/**
 * Result DTO for Section operations
 */
public record SectionResult(
    Long id,
    Long chapterId,
    Integer orderIndex,
    Long workingStatusSectionVersionId,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static SectionResult from(com.woi.content.domain.entities.Section section) {
        return new SectionResult(
            section.getId(),
            section.getChapterId(),
            section.getOrderIndex(),
            section.getWorkingStatusSectionVersionId(),
            section.getCreatedAt(),
            section.getUpdatedAt()
        );
    }
}

