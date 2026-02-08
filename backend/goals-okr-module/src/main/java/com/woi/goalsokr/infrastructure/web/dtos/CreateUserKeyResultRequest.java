package com.woi.goalsokr.infrastructure.web.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

/**
 * Request DTO for creating a user-specific key result
 */
public record CreateUserKeyResultRequest(
    @NotNull(message = "User Objective ID is required")
    Long userObjectiveId,
    
    @NotBlank(message = "Title is required")
    String title,
    
    String description, // Optional
    
    @Positive(message = "Target value must be positive")
    BigDecimal targetValue, // Optional
    
    String unit // Optional
) {}
