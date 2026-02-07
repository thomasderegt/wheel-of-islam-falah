package com.woi.goalsokr.infrastructure.web.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Request DTO for creating a user-specific goal
 */
public record CreateUserGoalRequest(
    @NotNull(message = "User ID is required")
    Long userId,
    
    Long lifeDomainId, // Optional
    
    @NotBlank(message = "Title is required")
    String title,
    
    String description // Optional
) {}
