package com.woi.content.application.results;

import java.time.LocalDateTime;

/**
 * Result DTO for SectionVersion operations
 */
public record SectionVersionResult(
    Long id,
    Long sectionId,
    Integer versionNumber,
    String titleEn,
    String titleNl,
    String introEn,
    String introNl,
    Long createdBy,
    LocalDateTime createdAt
) {
    public static SectionVersionResult from(com.woi.content.domain.entities.SectionVersion version) {
        return new SectionVersionResult(
            version.getId(),
            version.getSectionId(),
            version.getVersionNumber(),
            version.getTitleEn(),
            version.getTitleNl(),
            version.getIntroEn(),
            version.getIntroNl(),
            version.getCreatedBy(),
            version.getCreatedAt()
        );
    }
}

