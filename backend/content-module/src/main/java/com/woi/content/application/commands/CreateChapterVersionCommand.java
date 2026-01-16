package com.woi.content.application.commands;

/**
 * Command for creating a new chapter version
 */
public record CreateChapterVersionCommand(
    Long chapterId,
    String titleEn,
    String titleNl,
    String introEn,
    String introNl,
    Long userId
) {
    public CreateChapterVersionCommand {
        if (chapterId == null) {
            throw new IllegalArgumentException("Chapter ID cannot be null");
        }
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        // At least one title must be provided (validated in domain entity)
    }
}

