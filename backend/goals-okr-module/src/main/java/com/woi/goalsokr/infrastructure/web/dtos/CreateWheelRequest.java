package com.woi.goalsokr.infrastructure.web.dtos;

import jakarta.validation.constraints.NotBlank;

/**
 * Request DTO for creating a wheel
 */
public record CreateWheelRequest(
    @NotBlank(message = "Wheel key is required")
    String wheelKey,

    String nameNl,
    String nameEn,
    String descriptionNl,
    String descriptionEn,

    Integer displayOrder
) {}
