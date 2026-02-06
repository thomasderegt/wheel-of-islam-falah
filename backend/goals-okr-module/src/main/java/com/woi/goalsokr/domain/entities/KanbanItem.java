package com.woi.goalsokr.domain.entities;

import com.woi.goalsokr.domain.enums.ItemType;
import com.woi.goalsokr.domain.enums.KanbanColumn;

import java.time.LocalDateTime;

/**
 * KanbanItem domain entity - Pure POJO (no JPA annotations)
 *
 * Represents a kanban board item for a user.
 * Users can add goals, objectives, key results, or initiatives to their kanban board.
 *
 * Business rules:
 * - userId is required
 * - itemType and itemId are required
 * - columnName defaults to TODO
 * - position defaults to 0
 * - One item per type per user (enforced by unique constraint)
 */
public class KanbanItem {
    private Long id;
    private Long userId; // Required - Soft reference to User
    private ItemType itemType; // Required - GOAL, OBJECTIVE, KEY_RESULT, or INITIATIVE
    private Long itemId; // Required - ID of the selected item
    private KanbanColumn columnName; // Default: TODO
    private Integer position; // Default: 0 - Order within the column
    private String notes; // Optional notes
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Public constructor for mappers (infrastructure layer)
    public KanbanItem() {}

    /**
     * Factory method: Create a new kanban item
     *
     * @param userId User ID (required)
     * @param itemType Item type (required)
     * @param itemId Item ID (required)
     * @return New KanbanItem instance
     * @throws IllegalArgumentException if required fields are null or invalid
     */
    public static KanbanItem create(Long userId, ItemType itemType, Long itemId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (itemType == null) {
            throw new IllegalArgumentException("Item type cannot be null");
        }
        if (itemId == null || itemId <= 0) {
            throw new IllegalArgumentException("Item ID must be a positive integer");
        }

        KanbanItem item = new KanbanItem();
        item.userId = userId;
        item.itemType = itemType;
        item.itemId = itemId;
        item.columnName = KanbanColumn.TODO; // Default column
        item.position = 0; // Default position
        item.createdAt = LocalDateTime.now();
        item.updatedAt = LocalDateTime.now();
        return item;
    }

    /**
     * Update the column and position of this item
     */
    public void updatePosition(KanbanColumn newColumn, Integer newPosition) {
        if (newColumn == null) {
            throw new IllegalArgumentException("Column cannot be null");
        }
        if (newPosition == null || newPosition < 0) {
            throw new IllegalArgumentException("Position must be a non-negative integer");
        }
        this.columnName = newColumn;
        this.position = newPosition;
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Update notes
     */
    public void updateNotes(String notes) {
        this.notes = notes;
        this.updatedAt = LocalDateTime.now();
    }

    // Getters
    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public ItemType getItemType() { return itemType; }
    public Long getItemId() { return itemId; }
    public KanbanColumn getColumnName() { return columnName; }
    public Integer getPosition() { return position; }
    public String getNotes() { return notes; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // Setters for entity mapping (infrastructure layer only)
    public void setId(Long id) { this.id = id; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setItemType(ItemType itemType) { this.itemType = itemType; }
    public void setItemId(Long itemId) { this.itemId = itemId; }
    public void setColumnName(KanbanColumn columnName) { this.columnName = columnName; }
    public void setPosition(Integer position) { this.position = position; }
    public void setNotes(String notes) { this.notes = notes; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
