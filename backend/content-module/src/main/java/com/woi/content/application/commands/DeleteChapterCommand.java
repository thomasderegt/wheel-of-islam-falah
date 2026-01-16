package com.woi.content.application.commands;

/**
 * Command for deleting a chapter
 * 
 * Note: This will cascade delete all sections and paragraphs
 * in this chapter. Use with caution!
 */
public record DeleteChapterCommand(
    Long chapterId
) {
    public DeleteChapterCommand {
        if (chapterId == null) {
            throw new IllegalArgumentException("Chapter ID cannot be null");
        }
    }
}

