package com.woi.content.application.commands;

/**
 * Command for creating a new chapter
 */
public record CreateChapterCommand(
    Long bookId,
    Integer position  // 0 = center, 1-10 = circular (default = 0)
) {
    public CreateChapterCommand {
        if (bookId == null) {
            throw new IllegalArgumentException("Book ID cannot be null");
        }
        // Position validatie gebeurt in domain entity
    }
}

