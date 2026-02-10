package com.woi.goalsokr.infrastructure.web.dtos;

/**
 * Request DTO for updating a goal
 */
public record UpdateGoalRequest(
    String titleNl,
    String titleEn,
    String descriptionNl,
    String descriptionEn,
    Integer quarter,
    Integer year
) {}
