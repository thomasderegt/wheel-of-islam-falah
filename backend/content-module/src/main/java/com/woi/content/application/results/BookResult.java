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
    LocalDateTime updatedAt
) {
    public static BookResult from(com.woi.content.domain.entities.Book book) {
        return new BookResult(
            book.getId(),
            book.getCategoryId(),
            book.getBookNumber(),
            book.getWorkingStatusBookVersionId(),
            book.getCreatedAt(),
            book.getUpdatedAt()
        );
    }
}

