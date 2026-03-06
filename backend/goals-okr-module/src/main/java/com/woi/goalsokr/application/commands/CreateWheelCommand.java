package com.woi.goalsokr.application.commands;

/**
 * Command to create a new wheel
 */
public record CreateWheelCommand(
    String wheelKey,
    String nameNl,
    String nameEn,
    String descriptionNl,
    String descriptionEn,
    Integer displayOrder
) {
    public CreateWheelCommand {
        if (wheelKey == null || wheelKey.trim().isEmpty()) {
            throw new IllegalArgumentException("Wheel key cannot be null or empty");
        }
        if ((nameNl == null || nameNl.trim().isEmpty()) &&
            (nameEn == null || nameEn.trim().isEmpty())) {
            throw new IllegalArgumentException("At least one name (nameNl or nameEn) must be provided");
        }
        if (displayOrder == null) {
            displayOrder = 0;
        }
    }
}
