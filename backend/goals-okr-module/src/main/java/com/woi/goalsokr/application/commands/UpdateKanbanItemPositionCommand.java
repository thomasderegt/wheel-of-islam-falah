package com.woi.goalsokr.application.commands;

/**
 * Command to update kanban item position
 */
public record UpdateKanbanItemPositionCommand(
    Long itemId,
    String columnName, // TODO, IN_PROGRESS, IN_REVIEW, DONE
    Integer position
) {
    public UpdateKanbanItemPositionCommand {
        if (itemId == null || itemId <= 0) {
            throw new IllegalArgumentException("Item ID must be a positive integer");
        }
        if (columnName == null || columnName.trim().isEmpty()) {
            throw new IllegalArgumentException("Column name cannot be null or empty");
        }
        if (position == null || position < 0) {
            throw new IllegalArgumentException("Position must be a non-negative integer");
        }
    }
}
