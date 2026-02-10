package com.woi.goalsokr.infrastructure.web.dtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

/**
 * Request DTO for creating a goal
 */
public record CreateGoalRequest(
    @NotNull(message = "Life Domain ID is required")
    Long lifeDomainId,
    
    String titleNl,
    String titleEn,
    String descriptionNl,
    String descriptionEn,
    
    @NotNull(message = "Order index is required")
    @Positive(message = "Order index must be positive")
    Integer orderIndex,
    
    Integer quarter, // Program Increment quarter (1-4, optional)
    Integer year      // Program Increment year (e.g., 2025, optional)
) {}
