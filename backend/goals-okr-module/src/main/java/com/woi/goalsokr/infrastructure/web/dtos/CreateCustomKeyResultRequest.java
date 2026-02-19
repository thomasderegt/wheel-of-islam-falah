package com.woi.goalsokr.infrastructure.web.dtos;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

/**
 * Request DTO for creating a custom key result
 */
public record CreateCustomKeyResultRequest(
    @NotNull(message = "User Objective Instance ID is required")
    Long userObjectiveInstanceId,

    @NotBlank(message = "Title is required")
    String title,

    String description,

    @NotNull(message = "Target value is required")
    @DecimalMin(value = "0.01", message = "Target value must be positive")
    BigDecimal targetValue,

    @NotBlank(message = "Unit is required")
    String unit
) {}
