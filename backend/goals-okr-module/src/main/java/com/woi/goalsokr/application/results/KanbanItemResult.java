package com.woi.goalsokr.application.results;

import com.woi.goalsokr.domain.entities.KanbanItem;

/**
 * Result DTO for KanbanItem.
 * Enriched with title and lifeDomainId when returned by kanban list endpoints.
 */
public record KanbanItemResult(
    Long id,
    Long userId,
    String itemType, // OBJECTIVE, KEY_RESULT, INITIATIVE
    Long itemId,
    String columnName, // TODO, IN_PROGRESS, IN_REVIEW, DONE
    Integer position,
    String notes,
    String number,
    String createdAt,
    String updatedAt,
    Boolean readOnly, // true for team kanban items (read-only for members)
    String title,     // display title (resolved from objective/key result/initiative)
    Long lifeDomainId // for filtering by wheel/context; null if unresolved
) {
    public static KanbanItemResult from(KanbanItem item) {
        return from(item, false, null, null);
    }

    public static KanbanItemResult from(KanbanItem item, boolean readOnly) {
        return from(item, readOnly, null, null);
    }

    /** Enriched result with title and lifeDomainId (for list endpoints). */
    public static KanbanItemResult from(KanbanItem item, boolean readOnly, String title, Long lifeDomainId) {
        return new KanbanItemResult(
            item.getId(),
            item.getUserId(),
            item.getItemType().name(),
            item.getItemId(),
            item.getColumnName().name(),
            item.getPosition(),
            item.getNotes(),
            item.getNumber(),
            item.getCreatedAt() != null ? item.getCreatedAt().toString() : null,
            item.getUpdatedAt() != null ? item.getUpdatedAt().toString() : null,
            readOnly,
            title,
            lifeDomainId
        );
    }
}
