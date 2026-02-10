package com.woi.goalsokr.infrastructure.web.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Request DTO for creating a personal goal
 * Creates a Goal template + UserGoalInstance + Kanban item
 */
public record CreatePersonalGoalRequest(
    @NotNull(message = "Life Domain ID is required")
    Long lifeDomainId,
    
    @NotBlank(message = "Title is required")
    String title,
    
    String description // Optional
) {}
