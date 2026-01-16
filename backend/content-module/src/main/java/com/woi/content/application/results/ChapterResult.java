package com.woi.content.application.results;

import java.time.LocalDateTime;

/**
 * Result DTO for Chapter operations
 */
public record ChapterResult(
    Long id,
    Long bookId,
    Integer chapterNumber,
    Integer position,
    Long workingStatusChapterVersionId,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static ChapterResult from(com.woi.content.domain.entities.Chapter chapter) {
        return new ChapterResult(
            chapter.getId(),
            chapter.getBookId(),
            chapter.getChapterNumber(),
            chapter.getPosition(),
            chapter.getWorkingStatusChapterVersionId(),
            chapter.getCreatedAt(),
            chapter.getUpdatedAt()
        );
    }
}

