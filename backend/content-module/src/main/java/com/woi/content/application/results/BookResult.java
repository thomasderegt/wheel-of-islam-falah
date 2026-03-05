package com.woi.content.application.results;

import java.time.LocalDateTime;

/**
 * Result DTO for Book operations
 */
public record BookResult(
    Long id,
    Long categoryId,
    Integer bookNumber,
    Long workingStatusBookVersionId,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    String titleEn,
    String titleNl
) {
    public static BookResult from(com.woi.content.domain.entities.Book book) {
        return new BookResult(
            book.getId(),
            book.getCategoryId(),
            book.getBookNumber(),
            book.getWorkingStatusBookVersionId(),
            book.getCreatedAt(),
            book.getUpdatedAt(),
            null,
            null
        );
    }

    public static BookResult fromWithVersion(com.woi.content.domain.entities.Book book,
            com.woi.content.domain.entities.BookVersion version) {
        return new BookResult(
            book.getId(),
            book.getCategoryId(),
            book.getBookNumber(),
            book.getWorkingStatusBookVersionId(),
            book.getCreatedAt(),
            book.getUpdatedAt(),
            version != null ? version.getTitleEn() : null,
            version != null ? version.getTitleNl() : null
        );
    }
}

