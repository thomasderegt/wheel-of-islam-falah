package com.woi.goalsokr.infrastructure.web.dtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

/**
 * Request DTO for adding a kanban item
 */
public record AddKanbanItemRequest(
    @NotNull(message = "User ID is required")
    @Positive(message = "User ID must be positive")
    Long userId,
    
    @NotNull(message = "Item type is required")
    String itemType, // GOAL, OBJECTIVE, KEY_RESULT, INITIATIVE
    
    @NotNull(message = "Item ID is required")
    @Positive(message = "Item ID must be positive")
    Long itemId
) {}
