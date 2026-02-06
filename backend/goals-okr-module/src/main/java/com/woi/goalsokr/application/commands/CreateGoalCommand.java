package com.woi.goalsokr.application.commands;

/**
 * Command to create a new goal (template)
 */
public record CreateGoalCommand(
    Long lifeDomainId,
    String titleNl,
    String titleEn,
    String descriptionNl,
    String descriptionEn,
    Integer orderIndex
) {
    public CreateGoalCommand {
        if (lifeDomainId == null) {
            throw new IllegalArgumentException("Life Domain ID cannot be null");
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
