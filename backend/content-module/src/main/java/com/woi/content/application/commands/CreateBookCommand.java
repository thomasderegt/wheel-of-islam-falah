package com.woi.content.application.commands;

/**
 * Command for creating a new book
 */
public record CreateBookCommand(
    Long categoryId
) {
    public CreateBookCommand {
        if (categoryId == null) {
            throw new IllegalArgumentException("Category ID cannot be null");
        }
    }
}

