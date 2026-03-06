package com.woi.goalsokr.application.commands;

/**
 * Command to create a new life domain
 */
public record CreateLifeDomainCommand(
    Long wheelId,
    String titleNl,
    String titleEn,
    String descriptionNl,
    String descriptionEn,
    String iconName,
    Integer displayOrder
) {
    public CreateLifeDomainCommand {
        if (wheelId == null) {
            throw new IllegalArgumentException("Wheel ID cannot be null");
        }
        if ((titleNl == null || titleNl.trim().isEmpty()) &&
            (titleEn == null || titleEn.trim().isEmpty())) {
            throw new IllegalArgumentException("At least one title (titleNl or titleEn) must be provided");
        }
        if (displayOrder == null) {
            displayOrder = 0;
        }
    }
}
