package com.woi.goalsokr.infrastructure.web.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Request DTO for creating a user-specific objective
 */
public record CreateUserObjectiveRequest(
    @NotNull(message = "User ID is required")
    Long userId,
    
    @NotNull(message = "User Goal ID is required")
    Long userGoalId,
    
    @NotBlank(message = "Title is required")
    String title,
    
    String description // Optional
) {}
