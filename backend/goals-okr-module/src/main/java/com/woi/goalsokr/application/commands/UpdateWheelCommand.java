package com.woi.goalsokr.application.commands;

/**
 * Command to update an existing wheel
 */
public record UpdateWheelCommand(
    Long id,
    String wheelKey,
    String nameNl,
    String nameEn,
    String descriptionNl,
    String descriptionEn,
    Integer displayOrder
) {
    public UpdateWheelCommand {
        if (id == null) {
            throw new IllegalArgumentException("Wheel ID cannot be null");
        }
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
