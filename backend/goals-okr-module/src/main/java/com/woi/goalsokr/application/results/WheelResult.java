package com.woi.goalsokr.application.results;

/**
 * Result DTO for Wheel
 */
public record WheelResult(
    Long id,
    String wheelKey,
    String nameNl,
    String nameEn,
    String descriptionNl,
    String descriptionEn,
    Integer displayOrder
) {
    public static WheelResult from(com.woi.goalsokr.domain.entities.Wheel wheel) {
        return new WheelResult(
            wheel.getId(),
            wheel.getWheelKey(),
            wheel.getNameNl(),
            wheel.getNameEn(),
            wheel.getDescriptionNl(),
            wheel.getDescriptionEn(),
            wheel.getDisplayOrder()
        );
    }
}
