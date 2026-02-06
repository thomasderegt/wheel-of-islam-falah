package com.woi.goalsokr.application.commands;

/**
 * Command to delete a kanban item
 */
public record DeleteKanbanItemCommand(
    Long itemId
) {
    public DeleteKanbanItemCommand {
        if (itemId == null || itemId <= 0) {
            throw new IllegalArgumentException("Item ID must be a positive integer");
        }
    }
}
