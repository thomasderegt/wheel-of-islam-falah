package com.woi.content.application.results;

import java.time.LocalDateTime;

/**
 * Result DTO for BookVersion operations
 */
public record BookVersionResult(
    Long id,
    Long bookId,
    Integer versionNumber,
    String titleEn,
    String titleNl,
    String introEn,
    String introNl,
    Long createdBy,
    LocalDateTime createdAt
) {
    public static BookVersionResult from(com.woi.content.domain.entities.BookVersion version) {
        return new BookVersionResult(
            version.getId(),
            version.getBookId(),
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

