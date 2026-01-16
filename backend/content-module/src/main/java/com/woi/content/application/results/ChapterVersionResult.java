package com.woi.content.application.results;

import java.time.LocalDateTime;

/**
 * Result DTO for ChapterVersion operations
 */
public record ChapterVersionResult(
    Long id,
    Long chapterId,
    Integer versionNumber,
    String titleEn,
    String titleNl,
    String introEn,
    String introNl,
    Long createdBy,
    LocalDateTime createdAt
) {
    public static ChapterVersionResult from(com.woi.content.domain.entities.ChapterVersion version) {
        return new ChapterVersionResult(
            version.getId(),
            version.getChapterId(),
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

