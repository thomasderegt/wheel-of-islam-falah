package com.woi.content.application.commands;

/**
 * Command for deleting a section
 * 
 * Note: This will cascade delete all paragraphs in this section.
 * Use with caution!
 */
public record DeleteSectionCommand(
    Long sectionId
) {
    public DeleteSectionCommand {
        if (sectionId == null) {
            throw new IllegalArgumentException("Section ID cannot be null");
        }
    }
}

