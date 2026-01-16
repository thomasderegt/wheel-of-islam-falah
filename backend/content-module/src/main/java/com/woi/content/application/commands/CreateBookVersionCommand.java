package com.woi.content.application.commands;

/**
 * Command for creating a new book version
 */
public record CreateBookVersionCommand(
    Long bookId,
    String titleEn,
    String titleNl,
    String introEn,
    String introNl,
    Long userId
) {
    public CreateBookVersionCommand {
        if (bookId == null) {
            throw new IllegalArgumentException("Book ID cannot be null");
        }
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        // At least one title must be provided (validated in domain entity)
    }
}

