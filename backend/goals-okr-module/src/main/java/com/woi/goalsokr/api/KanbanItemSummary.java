package com.woi.goalsokr.api;

import java.time.LocalDateTime;

/**
 * Summary DTO for KanbanItem
 * Used in public API interface
 */
public record KanbanItemSummary(
    Long id,
    Long userId,
    String itemType, // GOAL, OBJECTIVE, KEY_RESULT, INITIATIVE
    Long itemId,
    String columnName, // TODO, IN_PROGRESS, IN_REVIEW, DONE
    Integer position,
    String notes,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
