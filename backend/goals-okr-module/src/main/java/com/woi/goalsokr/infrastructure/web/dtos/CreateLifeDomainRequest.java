package com.woi.goalsokr.infrastructure.web.dtos;

import jakarta.validation.constraints.NotNull;

/**
 * Request DTO for creating a life domain
 */
public record CreateLifeDomainRequest(
    @NotNull(message = "Wheel ID is required")
    Long wheelId,

    String titleNl,
    String titleEn,
    String descriptionNl,
    String descriptionEn,
    String iconName,

    Integer displayOrder
) {}
