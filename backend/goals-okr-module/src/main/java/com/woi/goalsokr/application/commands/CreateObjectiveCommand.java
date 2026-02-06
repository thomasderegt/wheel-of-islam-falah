package com.woi.goalsokr.application.commands;

/**
 * Command to create a new objective (template)
 */
public record CreateObjectiveCommand(
    Long goalId,
    String titleNl,
    String titleEn,
    String descriptionNl,
    String descriptionEn,
    Integer orderIndex
) {
    public CreateObjectiveCommand {
        if (goalId == null) {
            throw new IllegalArgumentException("Goal ID cannot be null");
        }
        if ((titleNl == null || titleNl.trim().isEmpty()) && 
            (titleEn == null || titleEn.trim().isEmpty())) {
            throw new IllegalArgumentException("At least one title (titleNl or titleEn) must be provided");
        }
        if (orderIndex == null || orderIndex < 1) {
            throw new IllegalArgumentException("Order index must be a positive integer");
        }
    }
}
