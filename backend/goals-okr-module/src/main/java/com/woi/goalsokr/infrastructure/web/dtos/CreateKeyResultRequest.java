package com.woi.goalsokr.infrastructure.web.dtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

/**
 * Request DTO for creating a key result
 */
public record CreateKeyResultRequest(
    @NotNull(message = "Objective ID is required")
    Long objectiveId,
    
    String titleNl,
    String titleEn,
    String descriptionNl,
    String descriptionEn,
    
    @NotNull(message = "Target value is required")
    @Positive(message = "Target value must be positive")
    BigDecimal targetValue,
    
    @NotNull(message = "Unit is required")
    String unit,
    
    @NotNull(message = "Order index is required")
    @Positive(message = "Order index must be positive")
    Integer orderIndex
) {}
