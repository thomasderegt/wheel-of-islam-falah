package com.woi.goalsokr.infrastructure.web.dtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import java.math.BigDecimal;

/**
 * Request DTO for updating key result progress
 */
public record UpdateKeyResultProgressRequest(
    @NotNull(message = "User ID is required")
    Long userId,
    
    @NotNull(message = "Key Result ID is required")
    Long keyResultId,
    
    @NotNull(message = "User Objective Instance ID is required")
    Long userObjectiveInstanceId,
    
    @Min(value = 0, message = "Current value cannot be negative")
    BigDecimal currentValue
) {}
