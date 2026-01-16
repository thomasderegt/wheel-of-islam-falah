package com.woi.content.application.commands;

/**
 * Command for deleting a book
 * 
 * Note: This will cascade delete all chapters, sections, and paragraphs
 * in this book. Use with caution!
 */
public record DeleteBookCommand(
    Long bookId
) {
    public DeleteBookCommand {
        if (bookId == null) {
            throw new IllegalArgumentException("Book ID cannot be null");
        }
    }
}

