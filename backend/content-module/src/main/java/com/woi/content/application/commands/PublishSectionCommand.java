package com.woi.content.application.commands;

/**
 * Command for publishing a section (DRAFT → PUBLISHED)
 */
public record PublishSectionCommand(
    Long sectionId,
    Long userId
) {
    public PublishSectionCommand {
        if (sectionId == null) {
            throw new IllegalArgumentException("Section ID cannot be null");
        }
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
    }
}

