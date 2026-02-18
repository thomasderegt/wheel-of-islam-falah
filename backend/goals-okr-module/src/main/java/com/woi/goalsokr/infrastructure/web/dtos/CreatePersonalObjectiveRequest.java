package com.woi.goalsokr.infrastructure.web.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Request DTO for creating a personal objective (Objective template + UserObjectiveInstance)
 */
public record CreatePersonalObjectiveRequest(
    @NotNull(message = "Life Domain ID is required")
    Long lifeDomainId,
    
    @NotBlank(message = "Title is required")
    String title,
    
    String description // Optional
) {}
