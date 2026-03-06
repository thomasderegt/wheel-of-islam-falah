package com.woi.goalsokr.infrastructure.web.dtos;

import jakarta.validation.constraints.NotNull;

/**
 * Request DTO for updating a life domain
 */
public record UpdateLifeDomainRequest(
    @NotNull(message = "Wheel ID is required")
    Long wheelId,

    String titleNl,
    String titleEn,
    String descriptionNl,
    String descriptionEn,
    String iconName,

    Integer displayOrder
) {}
