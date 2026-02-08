package com.woi.goalsokr.infrastructure.web.dtos;

import jakarta.validation.constraints.NotBlank;

/**
 * Request DTO for creating a user-specific goal
 */
public record CreateUserGoalRequest(
    Long lifeDomainId, // Optional
    
    @NotBlank(message = "Title is required")
    String title,
    
    String description // Optional
) {}
