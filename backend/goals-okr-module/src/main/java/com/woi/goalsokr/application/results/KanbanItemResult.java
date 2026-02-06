package com.woi.goalsokr.application.results;

import com.woi.goalsokr.domain.entities.KanbanItem;

/**
 * Result DTO for KanbanItem
 */
public record KanbanItemResult(
    Long id,
    Long userId,
    String itemType, // GOAL, OBJECTIVE, KEY_RESULT, INITIATIVE
    Long itemId,
    String columnName, // TODO, IN_PROGRESS, IN_REVIEW, DONE
    Integer position,
    String notes,
    String createdAt,
    String updatedAt
) {
    public static KanbanItemResult from(KanbanItem item) {
        return new KanbanItemResult(
            item.getId(),
            item.getUserId(),
            item.getItemType().name(),
            item.getItemId(),
            item.getColumnName().name(),
            item.getPosition(),
            item.getNotes(),
            item.getCreatedAt() != null ? item.getCreatedAt().toString() : null,
            item.getUpdatedAt() != null ? item.getUpdatedAt().toString() : null
        );
    }
}
