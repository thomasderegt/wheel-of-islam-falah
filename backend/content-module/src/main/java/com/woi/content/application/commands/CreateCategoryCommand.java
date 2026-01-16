package com.woi.content.application.commands;

/**
 * Command for creating a new category
 */
public record CreateCategoryCommand(
    String titleNl,
    String titleEn,
    String descriptionNl,
    String descriptionEn
) {
    public CreateCategoryCommand {
        // At least one title must be provided (validated in domain entity)
        if ((titleNl == null || titleNl.trim().isEmpty()) && 
            (titleEn == null || titleEn.trim().isEmpty())) {
            throw new IllegalArgumentException("At least one title (titleNl or titleEn) must be provided");
        }
    }
}

