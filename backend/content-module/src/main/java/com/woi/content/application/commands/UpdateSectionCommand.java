package com.woi.content.application.commands;

/**
 * Command for updating section metadata (orderIndex)
 */
public record UpdateSectionCommand(
    Long sectionId,
    Integer orderIndex
) {
    public UpdateSectionCommand {
        if (sectionId == null) {
            throw new IllegalArgumentException("Section ID cannot be null");
        }
        if (orderIndex == null || orderIndex < 0) {
            throw new IllegalArgumentException("OrderIndex must be a non-negative integer");
        }
    }
}

