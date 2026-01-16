package com.woi.content.application.commands;

/**
 * Command for creating a new section version
 */
public record CreateSectionVersionCommand(
    Long sectionId,
    String titleEn,
    String titleNl,
    String introEn,
    String introNl,
    Long userId
) {
    public CreateSectionVersionCommand {
        if (sectionId == null) {
            throw new IllegalArgumentException("Section ID cannot be null");
        }
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        // At least one title must be provided (validated in domain entity)
    }
}

