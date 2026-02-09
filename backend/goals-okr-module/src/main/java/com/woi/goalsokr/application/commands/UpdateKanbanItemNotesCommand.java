package com.woi.goalsokr.application.commands;

/**
 * Command to update kanban item notes
 */
public record UpdateKanbanItemNotesCommand(
    Long itemId,
    String notes // Can be null or empty to clear notes
) {
    public UpdateKanbanItemNotesCommand {
        if (itemId == null || itemId <= 0) {
            throw new IllegalArgumentException("Item ID must be a positive integer");
        }
        // Notes can be null or empty, so no validation needed
    }
}
