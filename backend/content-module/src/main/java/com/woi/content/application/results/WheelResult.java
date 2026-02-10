package com.woi.content.application.results;

import com.woi.content.domain.entities.Wheel;

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
    Integer displayOrder,
    java.time.LocalDateTime createdAt
) {
    public static WheelResult from(Wheel wheel) {
        return new WheelResult(
            wheel.getId(),
            wheel.getWheelKey(),
            wheel.getNameNl(),
            wheel.getNameEn(),
            wheel.getDescriptionNl(),
            wheel.getDescriptionEn(),
            wheel.getDisplayOrder(),
            wheel.getCreatedAt()
        );
    }
}
