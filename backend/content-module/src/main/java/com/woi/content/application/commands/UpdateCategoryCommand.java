package com.woi.content.application.commands;

/**
 * Command for updating category content
 */
public record UpdateCategoryCommand(
    Long categoryId,
    String titleNl,
    String titleEn,
    String descriptionNl,
    String descriptionEn
) {
    public UpdateCategoryCommand {
        if (categoryId == null) {
            throw new IllegalArgumentException("Category ID cannot be null");
        }
        // At least one title must be provided (validated in domain entity)
        if ((titleNl == null || titleNl.trim().isEmpty()) && 
            (titleEn == null || titleEn.trim().isEmpty())) {
            throw new IllegalArgumentException("At least one title (titleNl or titleEn) must be provided");
        }
    }
}

