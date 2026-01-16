package com.woi.content.application.commands;

/**
 * Command for creating a new section
 */
public record CreateSectionCommand(
    Long chapterId,
    Integer orderIndex
) {
    public CreateSectionCommand {
        if (chapterId == null) {
            throw new IllegalArgumentException("Chapter ID cannot be null");
        }
        if (orderIndex == null || orderIndex < 0) {
            throw new IllegalArgumentException("OrderIndex must be a non-negative integer");
        }
    }
}

