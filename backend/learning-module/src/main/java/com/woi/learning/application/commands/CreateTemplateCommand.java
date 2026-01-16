package com.woi.learning.application.commands;

/**
 * Command for creating a new learning flow template
 */
public record CreateTemplateCommand(
    String name,
    String description,
    Long sectionId,
    Long createdBy
) {
    public CreateTemplateCommand {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be null or empty");
        }
        if (sectionId == null) {
            throw new IllegalArgumentException("SectionId cannot be null");
        }
        if (createdBy == null) {
            throw new IllegalArgumentException("CreatedBy cannot be null");
        }
    }
}

