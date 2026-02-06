package com.woi.goalsokr.application.commands;

/**
 * Command to add a kanban item
 */
public record AddKanbanItemCommand(
    Long userId,
    String itemType, // GOAL, OBJECTIVE, KEY_RESULT, INITIATIVE
    Long itemId
) {
    public AddKanbanItemCommand {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (itemType == null || itemType.trim().isEmpty()) {
            throw new IllegalArgumentException("Item type cannot be null or empty");
        }
        if (itemId == null || itemId <= 0) {
            throw new IllegalArgumentException("Item ID must be a positive integer");
        }
    }
}
