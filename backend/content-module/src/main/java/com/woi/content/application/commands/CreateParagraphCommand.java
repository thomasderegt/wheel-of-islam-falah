package com.woi.content.application.commands;

/**
 * Command for creating a new paragraph
 */
public record CreateParagraphCommand(
    Long sectionId,
    Integer paragraphNumber  // Must be positive
) {
    public CreateParagraphCommand {
        if (sectionId == null) {
            throw new IllegalArgumentException("Section ID cannot be null");
        }
        if (paragraphNumber == null || paragraphNumber < 1) {
            throw new IllegalArgumentException("ParagraphNumber must be a positive integer");
        }
    }
}

