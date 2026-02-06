package com.woi.goalsokr.infrastructure.web.dtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

/**
 * Request DTO for updating kanban item position
 */
public record UpdateKanbanItemPositionRequest(
    @NotNull(message = "Column name is required")
    String columnName, // TODO, IN_PROGRESS, IN_REVIEW, DONE
    
    @NotNull(message = "Position is required")
    @Min(value = 0, message = "Position must be non-negative")
    Integer position
) {}
