package com.woi.goalsokr.infrastructure.web.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Request DTO for creating a personal objective (Objective template + UserObjectiveInstance)
 */
public record CreatePersonalObjectiveRequest(
    @NotNull(message = "User Goal Instance ID is required")
    Long userGoalInstanceId,
    
    @NotBlank(message = "Title is required")
    String title,
    
    String description // Optional
) {}
