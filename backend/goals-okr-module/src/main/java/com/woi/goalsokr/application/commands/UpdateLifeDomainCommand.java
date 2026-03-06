package com.woi.goalsokr.application.commands;

/**
 * Command to update an existing life domain
 */
public record UpdateLifeDomainCommand(
    Long id,
    Long wheelId,
    String titleNl,
    String titleEn,
    String descriptionNl,
    String descriptionEn,
    String iconName,
    Integer displayOrder
) {
    public UpdateLifeDomainCommand {
        if (id == null) {
            throw new IllegalArgumentException("Life domain ID cannot be null");
        }
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
