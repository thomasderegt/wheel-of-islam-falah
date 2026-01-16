package com.woi.content.application.commands;

/**
 * Command for updating book metadata (bookNumber)
 */
public record UpdateBookCommand(
    Long bookId,
    Integer bookNumber
) {
    public UpdateBookCommand {
        if (bookId == null) {
            throw new IllegalArgumentException("Book ID cannot be null");
        }
        // bookNumber is optional, but if provided must be positive
        if (bookNumber != null && bookNumber < 1) {
            throw new IllegalArgumentException("Book number must be a positive integer");
        }
    }
}

