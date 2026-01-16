package com.woi.content.application.commands;

/**
 * Command for updating chapter metadata (chapterNumber, position)
 */
public record UpdateChapterCommand(
    Long chapterId,
    Integer chapterNumber,
    Integer position
) {
    public UpdateChapterCommand {
        if (chapterId == null) {
            throw new IllegalArgumentException("Chapter ID cannot be null");
        }
        // chapterNumber is optional, but if provided must be positive
        if (chapterNumber != null && chapterNumber < 1) {
            throw new IllegalArgumentException("Chapter number must be a positive integer");
        }
        // position is optional, but if provided must be valid (0 or 1-10)
        if (position != null && !com.woi.content.domain.entities.Chapter.isValidPosition(position)) {
            throw new IllegalArgumentException(
                "Invalid position: " + position + ". Position must be 0 (center) or 1-10 (circular)"
            );
        }
    }
}

