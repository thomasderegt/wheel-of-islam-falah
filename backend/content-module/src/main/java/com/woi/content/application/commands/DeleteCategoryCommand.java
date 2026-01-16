package com.woi.content.application.commands;

/**
 * Command for deleting a category
 * 
 * Note: This will cascade delete all books, chapters, sections, and paragraphs
 * in this category. Use with caution!
 */
public record DeleteCategoryCommand(
    Long categoryId
) {
    public DeleteCategoryCommand {
        if (categoryId == null) {
            throw new IllegalArgumentException("Category ID cannot be null");
        }
    }
}

